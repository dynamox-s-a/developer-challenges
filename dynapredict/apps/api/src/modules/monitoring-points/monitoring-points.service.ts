import {
  isSensorModelAllowed,
  type MonitoringPointInput,
  type MonitoringPointListQuery,
  type MonitoringPointSortField,
  type SensorInput,
  type SortOrder,
} from '@dynapredict/shared';
import { AppError } from '../../errors/app-error.ts';
import { Prisma } from '../../generated/prisma/client.ts';
import { prisma } from '../../lib/prisma.ts';
import { getMachine } from '../machines/machines.service.ts';

// Cada coluna da lista e o campo do banco que a ordena. Máquina e sensor
// estão em outras tabelas: o Prisma faz o JOIN sozinho
const SORT_COLUMNS: Record<
  MonitoringPointSortField,
  (order: SortOrder) => Prisma.MonitoringPointOrderByWithRelationInput
> = {
  machineName: (order) => ({ machine: { name: order } }),
  machineType: (order) => ({ machine: { type: order } }),
  pointName: (order) => ({ name: order }),
  sensorModel: (order) => ({ sensor: { model: order } }),
};

// Uma página da lista de todos os pontos, já ordenada.
// "query" já chega validado (e com os valores padrão) pelo schema do shared
export async function listMonitoringPoints({
  page,
  pageSize,
  sortBy,
  order,
}: MonitoringPointListQuery) {
  const [total, items] = await Promise.all([
    prisma.monitoringPoint.count(),
    prisma.monitoringPoint.findMany({
      orderBy: [
        SORT_COLUMNS[sortBy](order),
        // Desempate: sem ele, linhas com o mesmo valor (ex.: vários pontos da
        // mesma máquina) podiam trocar de lugar e pular ou repetir entre páginas
        { machine: { name: 'asc' } },
        { name: 'asc' },
        { id: 'asc' },
      ],
      skip: (page - 1) * pageSize, // página 3 com 5 por página: pula 10
      take: pageSize,
      select: {
        id: true,
        name: true,
        machine: { select: { id: true, name: true, type: true } },
        sensor: { select: { id: true, model: true, serialNumber: true } },
      },
    }),
  ]);

  return { items, total, page, pageSize };
}

// Um ponto pelo id. Se não existir, lança 404
export async function getMonitoringPoint(id: string) {
  const point = await prisma.monitoringPoint.findUnique({ where: { id } });

  if (!point) {
    throw new AppError(
      404,
      'NOT_FOUND',
      'Ponto de monitoramento não encontrado',
    );
  }

  return point;
}

// "data" já chega validado pelo monitoringPointSchema
export async function createMonitoringPoint(
  machineId: string,
  data: MonitoringPointInput,
) {
  await getMachine(machineId); // 404 se a máquina não existir
  return prisma.monitoringPoint.create({ data: { ...data, machineId } });
}

export async function deleteMonitoringPoint(id: string) {
  await getMonitoringPoint(id); // garante o 404 antes de tentar apagar
  await prisma.monitoringPoint.delete({ where: { id } });
}

// Coloca um sensor no ponto. Se o ponto já tiver um, ele é trocado.
// "data" já chega validado pelo sensorSchema (formato e modelo do número)
export async function setSensor(pointId: string, data: SensorInput) {
  const point = await getMonitoringPoint(pointId); // 404 se não existir
  const machine = await getMachine(point.machineId);

  // Regra do negócio: TcAg e TcAs não podem ser usados em máquinas Pump
  if (!isSensorModelAllowed(machine.type, data.model)) {
    throw new AppError(
      422,
      'SENSOR_MODEL_NOT_ALLOWED',
      `Máquinas do tipo ${machine.type} não aceitam sensores ${data.model}`,
    );
  }

  try {
    // upsert: cria o sensor se o ponto ainda não tem um; se já tem, atualiza.
    // O "return await" é necessário para o catch pegar um erro do banco
    return await prisma.sensor.upsert({
      where: { monitoringPointId: pointId },
      create: { ...data, monitoringPointId: pointId },
      update: data,
    });
  } catch (error) {
    // P2002: o banco recusou um valor repetido numa coluna @unique. Aqui só
    // pode ser o serialNumber, porque o ponto é justamente o que o upsert busca
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new AppError(
        409,
        'SERIAL_NUMBER_IN_USE',
        `O número de série ${data.serialNumber} já está em outro sensor`,
      );
    }
    throw error; // outro erro qualquer continua sendo inesperado (500)
  }
}

// Tira o sensor do ponto. O sensor é apagado: ele só existe ligado a um ponto
export async function removeSensor(pointId: string) {
  await getMonitoringPoint(pointId); // 404 se o ponto não existir

  const sensor = await prisma.sensor.findUnique({
    where: { monitoringPointId: pointId },
  });

  if (!sensor) {
    throw new AppError(404, 'NOT_FOUND', 'Este ponto não tem sensor');
  }

  await prisma.sensor.delete({ where: { id: sensor.id } });
}
