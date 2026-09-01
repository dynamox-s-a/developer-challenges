import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { deterministicResourceId } from '@dynamox/contracts';
import {
  isSensorModelAllowedForMachine,
  type MachineType,
  type SensorModel,
} from '@dynamox/domain';

import { toDomainMachineType } from '../common/machine-type.mapper';
import { toDomainSensorModel, toPrismaSensorModel } from '../common/sensor-model.mapper';
import { PrismaService } from '../prisma/prisma.service';
import type {
  AssignSensorDto,
  CreateMonitoringPointDto,
  ListMonitoringPointsQuery,
  MonitoringPointSortColumn,
} from './monitoring-points.dto';

export interface MonitoringPointDto {
  id: string;
  name: string;
  machine: { id: string; name: string; type: MachineType };
  sensor: { id: string; serialNumber: string; model: SensorModel } | null;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringPointPageDto {
  items: MonitoringPointDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: MonitoringPointSortColumn;
  sortDir: 'asc' | 'desc';
  /** Eco do recorte aplicado: o cliente confirma o que o servidor de fato considerou. */
  search: string | null;
  machineType: MachineType | null;
  sensorModel: SensorModel | null;
  hasSensor: boolean | null;
}

/** Linha crua do SELECT da listagem (join de ponto, máquina e sensor). */
interface ListRow {
  id: string;
  pointName: string;
  createdAt: Date;
  updatedAt: Date;
  machineId: string;
  machineName: string;
  machineType: 'PUMP' | 'FAN';
  sensorId: string | null;
  sensorSerialNumber: string | null;
  sensorModel: 'TC_AG' | 'TC_AS' | 'HF_PLUS' | null;
}

/**
 * A ordenação acontece sempre sobre o VOCABULÁRIO PÚBLICO exibido na tabela
 * (Pump/Fan, TcAg/TcAs/HF+), e não sobre a ordem interna dos enums do PostgreSQL —
 * ordenar pelo enum colocaria "HF+" depois de "TcAs", contrariando o que o usuário
 * vê na tela. Por isso a listagem usa SQL com CASE em vez de `orderBy` do Prisma.
 * Os fragmentos vêm de um whitelist fechado; nada do request entra como SQL cru.
 */
const SORT_EXPRESSIONS: Record<MonitoringPointSortColumn, string> = {
  machineName: 'm.name',
  machineType: "CASE m.type::text WHEN 'PUMP' THEN 'Pump' ELSE 'Fan' END",
  pointName: 'mp.name',
  sensorModel:
    "CASE s.model::text WHEN 'TC_AG' THEN 'TcAg' WHEN 'TC_AS' THEN 'TcAs' WHEN 'HF_PLUS' THEN 'HF+' END",
};

/** Vocabulário público -> enum do banco, para filtrar sem vazar o enum interno. */
const MACHINE_TYPE_TO_DB: Record<MachineType, string> = { Pump: 'PUMP', Fan: 'FAN' };
const SENSOR_MODEL_TO_DB: Record<SensorModel, string> = {
  TcAg: 'TC_AG',
  TcAs: 'TC_AS',
  'HF+': 'HF_PLUS',
};

/**
 * Monta o recorte da listagem. Tudo vai como parâmetro (`Prisma.sql`), nunca concatenado:
 * o texto de busca é dado do usuário e não pode chegar ao SQL como fragmento.
 *
 * A busca é case-insensitive e por trecho, cobrindo os campos que a tabela exibe —
 * máquina, ponto e série do sensor — porque são os que a pessoa tem em mãos ao procurar.
 */
function buildListFilter(query: ListMonitoringPointsQuery): Prisma.Sql {
  const conditions: Prisma.Sql[] = [];

  if (query.search) {
    // escapa curingas do LIKE para que "%" digitado seja buscado literalmente
    const term = `%${query.search.replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
    conditions.push(Prisma.sql`(
      m.name ILIKE ${term} ESCAPE '\\'
      OR mp.name ILIKE ${term} ESCAPE '\\'
      OR s."serialNumber" ILIKE ${term} ESCAPE '\\'
    )`);
  }
  if (query.machineType) {
    conditions.push(Prisma.sql`m.type::text = ${MACHINE_TYPE_TO_DB[query.machineType]}`);
  }
  if (query.sensorModel) {
    conditions.push(Prisma.sql`s.model::text = ${SENSOR_MODEL_TO_DB[query.sensorModel]}`);
  }
  if (query.hasSensor !== null) {
    conditions.push(query.hasSensor ? Prisma.sql`s.id IS NOT NULL` : Prisma.sql`s.id IS NULL`);
  }

  return conditions.length === 0 ? Prisma.empty : Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;
}

function isUniqueViolation(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

/**
 * O `meta.target` do P2002 varia entre versões/drivers do Prisma: pode ser um array de
 * campos (`['serialNumber']`), o nome de um campo ou o nome da constraint
 * (`sensors_serialNumber_key`). A comparação é por substring para cobrir os três
 * formatos; um alvo irreconhecível cai num conflito genérico, nunca num código errado.
 */
function uniqueViolationInvolves(
  error: Prisma.PrismaClientKnownRequestError,
  field: string,
): boolean {
  const target = error.meta?.target;
  const entries = Array.isArray(target) ? target.map(String) : [String(target ?? '')];
  return entries.some((entry) => entry.includes(field));
}

@Injectable()
export class MonitoringPointsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMonitoringPointDto): Promise<MonitoringPointDto> {
    const machine = await this.prisma.machine.findUnique({ where: { id: dto.machineId } });
    if (!machine) {
      throw new NotFoundException({
        code: 'MACHINE_NOT_FOUND',
        message: `Máquina "${dto.machineId}" não encontrada.`,
      });
    }

    // Derivado do id (imutável) da máquina, e não do nome: renomear uma máquina, ou
    // recriar outra com o mesmo nome, nunca pode colidir com um resourceId antigo.
    const externalResourceId = deterministicResourceId(
      'dynamox-challenge',
      'monitoring-point',
      machine.id,
      dto.name,
    );

    try {
      const point = await this.prisma.monitoringPoint.create({
        data: { name: dto.name, machineId: machine.id, externalResourceId },
        include: { machine: true, sensor: true },
      });
      return this.toDto(point);
    } catch (error) {
      // Unicidade garantida pelo índice (machineId, name), não por consulta prévia.
      if (isUniqueViolation(error)) {
        throw new ConflictException({
          code: 'MONITORING_POINT_NAME_CONFLICT',
          message: `A máquina "${machine.name}" já tem um ponto chamado "${dto.name}".`,
        });
      }
      throw error;
    }
  }

  /**
   * Associa um sensor novo ao ponto. Transação com lock na linha da máquina: a regra
   * "Pump não aceita TcAg/TcAs" precisa valer mesmo se um PATCH concorrente estiver
   * trocando o tipo da máquina — o lock serializa os dois fluxos.
   */
  async assignSensor(pointId: string, dto: AssignSensorDto): Promise<MonitoringPointDto> {
    try {
      const point = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.monitoringPoint.findUnique({
          where: { id: pointId },
          include: { sensor: true },
        });
        if (!existing) throw this.pointNotFound(pointId);
        if (existing.sensor) {
          throw new ConflictException({
            code: 'MONITORING_POINT_SENSOR_CONFLICT',
            message: `O ponto "${existing.name}" já tem o sensor "${existing.sensor.serialNumber}" associado.`,
          });
        }

        // FOR UPDATE: o tipo é relido depois do lock, então a decisão da regra usa o
        // valor que valerá até o commit desta transação.
        const [machine] = await tx.$queryRaw<Array<{ name: string; type: 'PUMP' | 'FAN' }>>`
          SELECT name, type FROM machines WHERE id = ${existing.machineId} FOR UPDATE
        `;
        // A máquina pode ter sido excluída entre a leitura do ponto e o lock; o cascade
        // já terá levado o ponto junto, então a resposta honesta é 404, não 500.
        if (!machine) throw this.pointNotFound(pointId);
        const machineType = toDomainMachineType(machine.type);

        if (!isSensorModelAllowedForMachine(machineType, dto.model)) {
          throw new ConflictException({
            code: 'SENSOR_MODEL_NOT_ALLOWED',
            message: `O modelo "${dto.model}" não pode ser associado à máquina "${machine.name}" (${machineType}).`,
          });
        }

        await tx.sensor.create({
          data: {
            serialNumber: dto.serialNumber,
            model: toPrismaSensorModel(dto.model),
            monitoringPointId: existing.id,
          },
        });

        return tx.monitoringPoint.findUniqueOrThrow({
          where: { id: pointId },
          include: { machine: true, sensor: true },
        });
      });

      return this.toDto(point);
    } catch (error) {
      if (isUniqueViolation(error)) {
        // O mesmo P2002 cobre conflitos distintos; o alvo do índice desambigua.
        if (uniqueViolationInvolves(error, 'serialNumber')) {
          throw new ConflictException({
            code: 'SENSOR_SERIAL_CONFLICT',
            message: `Já existe um sensor com o identificador "${dto.serialNumber}".`,
          });
        }
        if (uniqueViolationInvolves(error, 'monitoringPointId')) {
          throw new ConflictException({
            code: 'MONITORING_POINT_SENSOR_CONFLICT',
            message: 'Este ponto de monitoramento acabou de receber outro sensor.',
          });
        }
        // Alvo irreconhecível: ainda é um conflito de unicidade, mas sem afirmar qual.
        throw new ConflictException({
          code: 'SENSOR_CONFLICT',
          message: 'Conflito de unicidade ao associar o sensor.',
        });
      }
      throw error;
    }
  }

  async list(query: ListMonitoringPointsQuery): Promise<MonitoringPointPageDto> {
    const sortExpression = SORT_EXPRESSIONS[query.sortBy];
    const direction = query.sortDir === 'desc' ? 'DESC' : 'ASC';
    const offset = (query.page - 1) * query.pageSize;
    // O MESMO recorte alimenta a página e a contagem: se o WHERE divergisse entre as duas
    // consultas, o total anunciado não corresponderia aos itens devolvidos.
    const where = buildListFilter(query);

    // As duas consultas compartilham o MESMO snapshot: em Repeatable Read o PostgreSQL
    // congela a visão dos dados na primeira leitura da transação, então `total` sempre
    // corresponde à página devolvida mesmo sob escrita concorrente. Read Committed não
    // bastaria — cada statement enxergaria um instante diferente.
    const [rows, [{ count }]] = await this.prisma.$transaction(
      [
        this.prisma.$queryRaw<ListRow[]>(Prisma.sql`
        SELECT
          mp.id,
          mp.name              AS "pointName",
          mp."createdAt",
          mp."updatedAt",
          m.id                 AS "machineId",
          m.name               AS "machineName",
          m.type::text         AS "machineType",
          s.id                 AS "sensorId",
          s."serialNumber"     AS "sensorSerialNumber",
          s.model::text        AS "sensorModel"
        FROM monitoring_points mp
        JOIN machines m ON m.id = mp."machineId"
        LEFT JOIN sensors s ON s."monitoringPointId" = mp.id
        ${where}
        ORDER BY ${Prisma.raw(sortExpression)} ${Prisma.raw(direction)} NULLS LAST,
                 mp.name ASC, mp.id ASC
        LIMIT ${query.pageSize} OFFSET ${offset}
      `),
        this.prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
        SELECT count(*)::bigint AS count
        FROM monitoring_points mp
        JOIN machines m ON m.id = mp."machineId"
        LEFT JOIN sensors s ON s."monitoringPointId" = mp.id
        ${where}
      `),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );

    const total = Number(count);

    return {
      items: rows.map((row) => ({
        id: row.id,
        name: row.pointName,
        machine: {
          id: row.machineId,
          name: row.machineName,
          type: toDomainMachineType(row.machineType),
        },
        sensor:
          row.sensorId && row.sensorSerialNumber && row.sensorModel
            ? {
                id: row.sensorId,
                serialNumber: row.sensorSerialNumber,
                model: toDomainSensorModel(row.sensorModel),
              }
            : null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
      total,
      page: query.page,
      pageSize: query.pageSize,
      // Derivado aqui para que o cliente não precise repetir a regra de arredondamento
      // (e não erre o "última página" quando o total não é múltiplo do tamanho).
      totalPages: Math.ceil(total / query.pageSize),
      sortBy: query.sortBy,
      sortDir: query.sortDir,
      search: query.search,
      machineType: query.machineType,
      sensorModel: query.sensorModel,
      hasSensor: query.hasSensor,
    };
  }

  private toDto(
    point: Prisma.MonitoringPointGetPayload<{ include: { machine: true; sensor: true } }>,
  ): MonitoringPointDto {
    return {
      id: point.id,
      name: point.name,
      machine: {
        id: point.machine.id,
        name: point.machine.name,
        type: toDomainMachineType(point.machine.type),
      },
      sensor: point.sensor
        ? {
            id: point.sensor.id,
            serialNumber: point.sensor.serialNumber,
            model: toDomainSensorModel(point.sensor.model),
          }
        : null,
      createdAt: point.createdAt.toISOString(),
      updatedAt: point.updatedAt.toISOString(),
    };
  }

  private pointNotFound(id: string): NotFoundException {
    return new NotFoundException({
      code: 'MONITORING_POINT_NOT_FOUND',
      message: `Ponto de monitoramento "${id}" não encontrado.`,
    });
  }
}
