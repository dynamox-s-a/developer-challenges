/**
 * Leitura e reconhecimento de alertas para a API. O motor escreve os episódios; este
 * serviço só os lê — e registra o reconhecimento humano, que é ortogonal ao estado.
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  type AlertCounts,
  type AlertDetailDto,
  type AlertListResponseDto,
  type AlertOccurrenceDto,
  EMPTY_ALERT_COUNTS,
  resolveByNaturalKey,
} from '@dynamox/domain';

import { toPrismaAlertLevel, toPrismaAlertType } from '../common/alert.mapper';
import { PrismaService } from '../prisma/prisma.service';
import { toRuleRecord } from './alert-rules';
import { type AcknowledgeAlertDto, type AlertListQuery } from './alerts.dto';
import {
  OCCURRENCE_INCLUDE,
  type OccurrenceRow,
  toAlertBaselineDto,
  toAlertEventDto,
  toAlertOccurrenceDto,
} from './alerts.presenter';

export interface Actor {
  sub: string;
  email: string;
}

@Injectable()
export class AlertsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AlertListQuery): Promise<AlertListResponseDto> {
    const universe = await this.universeWhere(query);
    const where: Prisma.AlertOccurrenceWhereInput = { ...universe, ...statusWhere(query.status) };
    const orderBy: Prisma.AlertOccurrenceOrderByWithRelationInput[] =
      query.sortBy === 'level'
        ? [{ level: query.sortDir }, { openedAt: 'desc' }]
        : [{ [query.sortBy]: query.sortDir }, { id: 'asc' }];

    const [total, rows, counts] = await Promise.all([
      this.prisma.alertOccurrence.count({ where }),
      this.prisma.alertOccurrence.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: OCCURRENCE_INCLUDE,
      }),
      this.counts(universe),
    ]);

    return {
      items: rows.map(toAlertOccurrenceDto),
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      counts,
      status: query.status,
      level: query.level,
      type: query.type,
      machine: query.machine,
      sensor: query.sensor,
      search: query.search,
      from: query.from?.toISOString() ?? null,
      to: query.to?.toISOString() ?? null,
      sortBy: query.sortBy,
      sortDir: query.sortDir,
    };
  }

  async detail(id: string): Promise<AlertDetailDto> {
    const row = await this.prisma.alertOccurrence.findUnique({ where: { id }, include: OCCURRENCE_INCLUDE });
    if (!row) throw alertNotFound(id);
    return this.toDetail(row);
  }

  /**
   * Reconhecer é dizer "vi": não resolve nem silencia. Idempotente — um segundo POST devolve
   * o mesmo estado sem novo evento. Permitido em episódio resolvido ("voltou ao normal,
   * ciente"). A escalada A1→A2 limpa o reconhecimento, e é o motor quem faz isso.
   */
  async acknowledge(id: string, dto: AcknowledgeAlertDto, actor: Actor): Promise<AlertDetailDto> {
    const row = await this.prisma.alertOccurrence.findUnique({ where: { id }, include: OCCURRENCE_INCLUDE });
    if (!row) throw alertNotFound(id);
    if (row.acknowledgedAt !== null) return this.toDetail(row);

    const now = new Date();
    const updated = await this.prisma.$transaction(async (tx) => {
      // Relê com lock: uma escalada concorrente não pode ser "reconhecida" pelo ACK do A1.
      const locked = await tx.$queryRaw<Array<{ id: string; acknowledgedAt: Date | null; level: string }>>`
        SELECT o.id, o."acknowledgedAt", o.level::text AS level FROM alert_occurrences o WHERE o.id = ${id} FOR UPDATE
      `;
      if (locked.length === 0) throw alertNotFound(id);
      if (locked[0].acknowledgedAt !== null) return null;
      const level = locked[0].level === 'A2' ? 'A2' : 'A1';
      await tx.alertOccurrence.update({
        where: { id },
        data: {
          acknowledgedAt: now,
          acknowledgedById: actor.sub,
          acknowledgedByEmail: actor.email,
          acknowledgedLevel: level,
          acknowledgeNote: dto.note,
        },
      });
      await tx.alertEvent.create({
        data: {
          alertId: id,
          type: 'ACKNOWLEDGED',
          fromState: row.state,
          toState: row.state,
          fromLevel: level,
          toLevel: level,
          occurredAt: now,
          actorUserId: actor.sub,
          actorEmail: actor.email,
          note: dto.note,
        },
      });
      return tx.alertOccurrence.findUniqueOrThrow({ where: { id }, include: OCCURRENCE_INCLUDE });
    });
    return this.toDetail(updated ?? (await this.prisma.alertOccurrence.findUniqueOrThrow({ where: { id }, include: OCCURRENCE_INCLUDE })));
  }

  private async toDetail(row: OccurrenceRow): Promise<AlertDetailDto> {
    const [events, state] = await Promise.all([
      this.prisma.alertEvent.findMany({ where: { alertId: row.id }, orderBy: [{ occurredAt: 'asc' }, { createdAt: 'asc' }] }),
      // Escopo de frota não tem ponto: a regra de presença não aprende baseline alguma.
      row.monitoringPointId === null
        ? Promise.resolve(null)
        : this.prisma.alertRuleState.findUnique({
            where: { ruleId_monitoringPointId: { ruleId: row.ruleId, monitoringPointId: row.monitoringPointId } },
          }),
    ]);
    return {
      ...toAlertOccurrenceDto(row),
      rule: toRuleRecord(row.rule),
      baseline: state && row.rule.learningCycles !== null ? toAlertBaselineDto(state, row.sensorSerialNumber) : null,
      events: events.map(toAlertEventDto),
    };
  }

  /** Universo da consulta SEM o recorte por status — é o que `counts` descreve. */
  private async universeWhere(query: AlertListQuery): Promise<Prisma.AlertOccurrenceWhereInput> {
    const where: Prisma.AlertOccurrenceWhereInput = {};
    if (query.level) where.level = toPrismaAlertLevel(query.level);
    if (query.type) where.type = toPrismaAlertType(query.type);
    if (query.sensor) where.sensorSerialNumber = query.sensor;
    if (query.machine) where.machineId = await this.resolveMachineId(query.machine);
    if (query.search) {
      // Busca nos SNAPSHOTS do episódio (não no cadastro): o histórico sobrevive à exclusão.
      const contains = { contains: query.search, mode: 'insensitive' as const };
      where.OR = [
        { sensorSerialNumber: contains },
        { machineName: contains },
        { monitoringPointName: contains },
      ];
    }
    // Interseção com a janela: esteve ativo em algum instante de [from, to).
    const temporal: Prisma.AlertOccurrenceWhereInput[] = [];
    if (query.to) temporal.push({ openedAt: { lt: query.to } });
    if (query.from) temporal.push({ OR: [{ resolvedAt: null }, { resolvedAt: { gte: query.from } }] });
    if (temporal.length > 0) where.AND = temporal;
    return where;
  }

  private async counts(universe: Prisma.AlertOccurrenceWhereInput): Promise<AlertCounts> {
    const [groups, acknowledged] = await Promise.all([
      this.prisma.alertOccurrence.groupBy({ by: ['state', 'level'], where: universe, _count: { _all: true } }),
      this.prisma.alertOccurrence.count({ where: { ...universe, state: 'ACTIVE', acknowledgedAt: { not: null } } }),
    ]);
    const counts: AlertCounts = { ...EMPTY_ALERT_COUNTS };
    for (const group of groups) {
      const n = group._count._all;
      counts.total += n;
      if (group.state === 'RESOLVED') counts.resolved += n;
      else if (group.level === 'A2') counts.activeA2 += n;
      else counts.activeA1 += n;
    }
    counts.acknowledged = acknowledged;
    counts.open = counts.activeA1 + counts.activeA2 - acknowledged;
    return counts;
  }

  private async resolveMachineId(machineKey: string): Promise<string> {
    const machines = await this.prisma.machine.findMany({ select: { id: true, name: true } });
    const resolved = resolveByNaturalKey(machines, machineKey, (machine) => machine.name);
    if (resolved.kind === 'ambiguous') {
      throw new BadRequestException({
        code: 'AMBIGUOUS_MACHINE_KEY',
        message: `O identificador "${machineKey}" corresponde a mais de uma máquina: ${resolved.items.map((m) => m.name).join(', ')}.`,
      });
    }
    if (resolved.kind === 'not-found') {
      throw new NotFoundException({ code: 'MACHINE_NOT_FOUND', message: `Máquina "${machineKey}" não encontrada.` });
    }
    return resolved.item.id;
  }
}

function statusWhere(status: AlertListQuery['status']): Prisma.AlertOccurrenceWhereInput {
  switch (status) {
    case 'open':
      return { state: 'ACTIVE', acknowledgedAt: null };
    case 'acknowledged':
      return { state: 'ACTIVE', acknowledgedAt: { not: null } };
    case 'resolved':
      return { state: 'RESOLVED' };
    case 'active':
      return { state: 'ACTIVE' };
    default:
      return {};
  }
}

function alertNotFound(id: string): NotFoundException {
  return new NotFoundException({ code: 'ALERT_NOT_FOUND', message: `Alerta "${id}" não encontrado.` });
}

export type { AlertOccurrenceDto };
