import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../shared/errors';
import {
  assertSensorAllowedForMachine,
  toPrismaSensorModel,
  toSharedMachineType,
  toSharedSensorModel,
} from './monitoring-points.mappers';
import type {
  AssociateSensorInput,
  CreateMonitoringPointInput,
  ListMonitoringPointsQuery,
} from './monitoring-points.schemas';

type PointWithRelations = Prisma.MonitoringPointGetPayload<{
  include: { machine: true; sensor: true };
}>;

function mapMonitoringPoint(point: PointWithRelations) {
  return {
    id: point.id,
    name: point.name,
    machineId: point.machineId,
    machineName: point.machine.name,
    machineType: toSharedMachineType(point.machine.type),
    sensorModel: point.sensor ? toSharedSensorModel[point.sensor.model] : null,
    sensorId: point.sensor?.id ?? null,
    createdAt: point.createdAt.toISOString(),
    updatedAt: point.updatedAt.toISOString(),
  };
}

function buildOrderBy(
  sortBy: ListMonitoringPointsQuery['sortBy'],
  order: ListMonitoringPointsQuery['order']
): Prisma.MonitoringPointOrderByWithRelationInput {
  switch (sortBy) {
    case 'machineName':
      return { machine: { name: order } };
    case 'machineType':
      return { machine: { type: order } };
    case 'sensorModel':
      return { sensor: { model: order } };
    case 'name':
    default:
      return { name: order };
  }
}

export async function createMonitoringPoint(
  machineId: string,
  input: CreateMonitoringPointInput
) {
  const machine = await prisma.machine.findUnique({ where: { id: machineId } });
  if (!machine) {
    throw new AppError(404, 'Machine not found');
  }

  const point = await prisma.monitoringPoint.create({
    data: {
      name: input.name,
      machineId,
    },
    include: { machine: true, sensor: true },
  });

  return mapMonitoringPoint(point);
}

export async function listMonitoringPointsByMachine(machineId: string) {
  const machine = await prisma.machine.findUnique({ where: { id: machineId } });
  if (!machine) {
    throw new AppError(404, 'Machine not found');
  }

  const points = await prisma.monitoringPoint.findMany({
    where: { machineId },
    include: { machine: true, sensor: true },
    orderBy: { createdAt: 'asc' },
  });

  return points.map(mapMonitoringPoint);
}

export async function listMonitoringPoints(query: ListMonitoringPointsQuery) {
  const { page, limit, sortBy, order } = query;
  const skip = (page - 1) * limit;

  const [total, points] = await prisma.$transaction([
    prisma.monitoringPoint.count(),
    prisma.monitoringPoint.findMany({
      include: { machine: true, sensor: true },
      orderBy: buildOrderBy(sortBy, order),
      skip,
      take: limit,
    }),
  ]);

  return {
    data: points.map(mapMonitoringPoint),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getMonitoringPoint(id: string) {
  const point = await prisma.monitoringPoint.findUnique({
    where: { id },
    include: { machine: true, sensor: true },
  });
  if (!point) {
    throw new AppError(404, 'Monitoring point not found');
  }
  return mapMonitoringPoint(point);
}

export async function deleteMonitoringPoint(id: string) {
  const point = await prisma.monitoringPoint.findUnique({ where: { id } });
  if (!point) {
    throw new AppError(404, 'Monitoring point not found');
  }
  await prisma.monitoringPoint.delete({ where: { id } });
}

export async function associateSensor(pointId: string, input: AssociateSensorInput) {
  const point = await prisma.monitoringPoint.findUnique({
    where: { id: pointId },
    include: { machine: true, sensor: true },
  });

  if (!point) {
    throw new AppError(404, 'Monitoring point not found');
  }

  if (point.sensor) {
    throw new AppError(409, 'Monitoring point already has a sensor associated');
  }

  if (!assertSensorAllowedForMachine(point.machine.type, input.model)) {
    throw new AppError(
      400,
      `Sensor model "${input.model}" is not allowed for machines of type "Pump". Use "HF+" instead.`
    );
  }

  const existingSensor = await prisma.sensor.findUnique({
    where: { id: input.sensorId },
  });
  if (existingSensor) {
    throw new AppError(409, 'Sensor ID must be unique');
  }

  await prisma.sensor.create({
    data: {
      id: input.sensorId,
      model: toPrismaSensorModel[input.model],
      monitoringPointId: pointId,
    },
  });

  const updated = await prisma.monitoringPoint.findUniqueOrThrow({
    where: { id: pointId },
    include: { machine: true, sensor: true },
  });

  return mapMonitoringPoint(updated);
}

export async function removeSensor(pointId: string) {
  const point = await prisma.monitoringPoint.findUnique({
    where: { id: pointId },
    include: { sensor: true },
  });

  if (!point) {
    throw new AppError(404, 'Monitoring point not found');
  }

  if (!point.sensor) {
    throw new AppError(404, 'No sensor associated with this monitoring point');
  }

  await prisma.sensor.delete({ where: { monitoringPointId: pointId } });
}
