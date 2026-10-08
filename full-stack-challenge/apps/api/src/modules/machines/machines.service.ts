import {
  type MachineDetailDto,
  type MachineDto,
  type Paginated,
  disallowedSensorModels,
  sensorModelFromKey,
  sensorModelToKey,
} from '@dynapredict/shared-types';
import { AppError } from '../../errors/AppError';
import { lockMachine } from '../../lib/locks';
import { pageArgs, paginationMeta } from '../../lib/pagination';
import { prisma } from '../../lib/prisma';
import type { ListMachinesQuery, MachineInput } from './machines.schemas';

const machineSelect = {
  id: true,
  name: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { monitoringPoints: true } },
} as const;

const machineDetailSelect = {
  id: true,
  name: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  monitoringPoints: {
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      sensor: {
        select: {
          id: true,
          serialNumber: true,
          model: true,
          monitoringPointId: true,
          createdAt: true,
        },
      },
    },
  },
} as const;

type MachineRow = Awaited<
  ReturnType<
    typeof prisma.machine.findFirstOrThrow<{ select: typeof machineSelect }>
  >
>;
type MachineDetailRow = Awaited<
  ReturnType<
    typeof prisma.machine.findFirstOrThrow<{
      select: typeof machineDetailSelect;
    }>
  >
>;

function toMachineDto(row: MachineRow): MachineDto {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    monitoringPointsCount: row._count.monitoringPoints,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toMachineDetailDto(row: MachineDetailRow): MachineDetailDto {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    monitoringPoints: row.monitoringPoints.map((point) => ({
      id: point.id,
      name: point.name,
      createdAt: point.createdAt.toISOString(),
      updatedAt: point.updatedAt.toISOString(),
      sensor: point.sensor && {
        ...point.sensor,
        model: sensorModelFromKey(point.sensor.model),
        createdAt: point.sensor.createdAt.toISOString(),
      },
    })),
  };
}

export async function listMachines(
  query: ListMachinesQuery,
): Promise<Paginated<MachineDto>> {
  const [rows, total] = await prisma.$transaction([
    prisma.machine.findMany({
      select: machineSelect,
      // id breaks ties so pages stay stable when sort values repeat.
      orderBy: [{ [query.sortBy]: query.sortDir }, { id: 'asc' }],
      ...pageArgs(query),
    }),
    prisma.machine.count(),
  ]);
  return { data: rows.map(toMachineDto), meta: paginationMeta(query, total) };
}

export async function getMachine(id: string): Promise<MachineDetailDto> {
  const row = await prisma.machine.findUnique({
    where: { id },
    select: machineDetailSelect,
  });
  if (!row) throw AppError.notFound('Machine not found');
  return toMachineDetailDto(row);
}

export async function createMachine(input: MachineInput): Promise<MachineDto> {
  const row = await prisma.machine.create({
    data: input,
    select: machineSelect,
  });
  return toMachineDto(row);
}

/**
 * Changing a machine's type must not leave it with sensors the new type
 * forbids (e.g. Fan -> Pump while a TcAg is attached). The machine lock makes
 * the check and the update atomic with respect to attachSensor.
 */
export async function updateMachine(
  id: string,
  input: MachineInput,
): Promise<MachineDto> {
  return prisma.$transaction(async (tx) => {
    await lockMachine(tx, id);
    const current = await tx.machine.findUnique({
      where: { id },
      select: { type: true },
    });
    if (!current) throw AppError.notFound('Machine not found');

    const disallowed = disallowedSensorModels(input.type);
    if (current.type !== input.type && disallowed.length > 0) {
      const conflicting = await tx.sensor.findMany({
        where: {
          monitoringPoint: { machineId: id },
          model: { in: disallowed.map(sensorModelToKey) },
        },
        select: { serialNumber: true, model: true },
      });
      if (conflicting.length > 0) {
        throw AppError.unprocessable(
          `A ${input.type} machine cannot have ${disallowed.join(' or ')} sensors`,
          {
            sensors: conflicting.map((sensor) => ({
              serialNumber: sensor.serialNumber,
              model: sensorModelFromKey(sensor.model),
            })),
          },
        );
      }
    }

    const row = await tx.machine.update({
      where: { id },
      data: input,
      select: machineSelect,
    });
    return toMachineDto(row);
  });
}

/** Deletes the machine; the database cascades to points, sensors and readings. */
export async function deleteMachine(id: string): Promise<void> {
  const { count } = await prisma.machine.deleteMany({ where: { id } });
  if (count === 0) throw AppError.notFound('Machine not found');
}
