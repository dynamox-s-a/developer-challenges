import {
  type MonitoringPointDto,
  type MonitoringPointListItemDto,
  type MonitoringPointSortField,
  type Paginated,
  type SortDirection,
  sensorModelFromKey,
} from '@dynapredict/shared-types';
import { AppError } from '../../errors/AppError';
import type { Prisma } from '../../generated/prisma/client';
import { pageArgs, paginationMeta } from '../../lib/pagination';
import { orNotFound } from '../../lib/prismaErrors';
import { prisma } from '../../lib/prisma';
import type {
  ListMonitoringPointsQuery,
  MonitoringPointInput,
} from './monitoring-points.schemas';

const sensorSelect = {
  id: true,
  serialNumber: true,
  model: true,
  monitoringPointId: true,
  createdAt: true,
} as const;

const monitoringPointSelect = {
  id: true,
  name: true,
  machineId: true,
  createdAt: true,
  updatedAt: true,
  sensor: { select: sensorSelect },
} as const;

const monitoringPointListSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  machine: { select: { id: true, name: true, type: true } },
  sensor: { select: sensorSelect },
} as const;

/**
 * The only way user input reaches `orderBy`: each public sort field maps to a
 * fixed Prisma clause. Enum columns sort alphabetically because the enums are
 * declared in alphabetical order (see schema.prisma). Points without a sensor
 * follow PostgreSQL's default for NULLs: last in asc, first in desc.
 */
const sortClauses: Record<
  MonitoringPointSortField,
  (dir: SortDirection) => Prisma.MonitoringPointOrderByWithRelationInput
> = {
  machineName: (dir) => ({ machine: { name: dir } }),
  machineType: (dir) => ({ machine: { type: dir } }),
  pointName: (dir) => ({ name: dir }),
  sensorModel: (dir) => ({ sensor: { model: dir } }),
};

type MonitoringPointListRow = Awaited<
  ReturnType<
    typeof prisma.monitoringPoint.findFirstOrThrow<{
      select: typeof monitoringPointListSelect;
    }>
  >
>;

type MonitoringPointRow = Awaited<
  ReturnType<
    typeof prisma.monitoringPoint.findFirstOrThrow<{
      select: typeof monitoringPointSelect;
    }>
  >
>;

/** Both row shapes share the date and sensor fields the DTOs serialize. */
function toMonitoringPointDto(row: MonitoringPointRow): MonitoringPointDto;
function toMonitoringPointDto(
  row: MonitoringPointListRow,
): MonitoringPointListItemDto;
function toMonitoringPointDto(
  row: MonitoringPointRow | MonitoringPointListRow,
): MonitoringPointDto | MonitoringPointListItemDto {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    sensor: row.sensor && {
      ...row.sensor,
      model: sensorModelFromKey(row.sensor.model),
      createdAt: row.sensor.createdAt.toISOString(),
    },
  };
}

/** Every point across all machines, one page at a time, in a single round trip. */
export async function listMonitoringPoints(
  query: ListMonitoringPointsQuery,
): Promise<Paginated<MonitoringPointListItemDto>> {
  const [rows, total] = await prisma.$transaction([
    prisma.monitoringPoint.findMany({
      select: monitoringPointListSelect,
      // Machine and point names group rows sensibly when the sort column
      // repeats; id makes the order total so pages never overlap.
      orderBy: [
        sortClauses[query.sortBy](query.sortDir),
        { machine: { name: 'asc' } },
        { name: 'asc' },
        { id: 'asc' },
      ],
      ...pageArgs(query),
    }),
    prisma.monitoringPoint.count(),
  ]);
  return {
    data: rows.map((row) => toMonitoringPointDto(row)),
    meta: paginationMeta(query, total),
  };
}

/** One point with its machine and sensor, e.g. for the series page. */
export async function getMonitoringPoint(
  id: string,
): Promise<MonitoringPointListItemDto> {
  const row = await prisma.monitoringPoint.findUnique({
    where: { id },
    select: monitoringPointListSelect,
  });
  if (!row) throw AppError.notFound('Monitoring point not found');
  return toMonitoringPointDto(row);
}

export async function createMonitoringPoint(
  machineId: string,
  input: MonitoringPointInput,
): Promise<MonitoringPointDto> {
  // `connect` fails with P2025 if the machine is gone, including when it is
  // deleted concurrently, so there's no window for a dangling foreign key.
  const row = await orNotFound(
    prisma.monitoringPoint.create({
      data: { name: input.name, machine: { connect: { id: machineId } } },
      select: monitoringPointSelect,
    }),
    'Machine not found',
  );
  return toMonitoringPointDto(row);
}

/** Renames a point. Moving it to another machine is not supported. */
export async function updateMonitoringPoint(
  id: string,
  input: MonitoringPointInput,
): Promise<MonitoringPointDto> {
  const row = await orNotFound(
    prisma.monitoringPoint.update({
      where: { id },
      data: { name: input.name },
      select: monitoringPointSelect,
    }),
    'Monitoring point not found',
  );
  return toMonitoringPointDto(row);
}

/** Deletes the point; the database cascades to its sensor and readings. */
export async function deleteMonitoringPoint(id: string): Promise<void> {
  const { count } = await prisma.monitoringPoint.deleteMany({ where: { id } });
  if (count === 0) throw AppError.notFound('Monitoring point not found');
}
