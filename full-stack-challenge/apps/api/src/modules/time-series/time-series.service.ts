import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../shared/errors';
import { forecastLinear } from './forecast';
import type {
  CreateReadingsInput,
  ForecastQuery,
  ReadingsRangeQuery,
} from './time-series.schemas';

function buildTimestampFilter(range?: ReadingsRangeQuery): Prisma.DateTimeFilter | undefined {
  if (!range?.from && !range?.to) {
    return undefined;
  }

  return {
    ...(range.from ? { gte: new Date(range.from) } : {}),
    ...(range.to ? { lte: new Date(range.to) } : {}),
  };
}

async function getPointOrThrow(pointId: string) {
  const point = await prisma.monitoringPoint.findUnique({
    where: { id: pointId },
    include: { sensor: true },
  });

  if (!point) {
    throw new AppError(404, 'Monitoring point not found');
  }

  return point;
}

function mapReading(reading: {
  id: string;
  monitoringPointId: string;
  timestamp: Date;
  value: number;
}) {
  return {
    id: reading.id,
    monitoringPointId: reading.monitoringPointId,
    timestamp: reading.timestamp.toISOString(),
    value: reading.value,
  };
}

export async function storeReadings(pointId: string, input: CreateReadingsInput) {
  const point = await getPointOrThrow(pointId);

  if (!point.sensor) {
    throw new AppError(
      400,
      'Associate a sensor to this monitoring point before storing time-series data'
    );
  }

  const created = await prisma.sensorReading.createMany({
    data: input.readings.map((reading) => ({
      monitoringPointId: pointId,
      timestamp: new Date(reading.timestamp),
      value: reading.value,
    })),
  });

  return { insertedCount: created.count };
}

export async function listReadings(pointId: string, range?: ReadingsRangeQuery) {
  await getPointOrThrow(pointId);

  const timestamp = buildTimestampFilter(range);
  const readings = await prisma.sensorReading.findMany({
    where: {
      monitoringPointId: pointId,
      ...(timestamp ? { timestamp } : {}),
    },
    orderBy: { timestamp: 'asc' },
  });

  return readings.map(mapReading);
}

export async function getMetrics(pointId: string, range?: ReadingsRangeQuery) {
  await getPointOrThrow(pointId);

  const timestamp = buildTimestampFilter(range);
  const where: Prisma.SensorReadingWhereInput = {
    monitoringPointId: pointId,
    ...(timestamp ? { timestamp } : {}),
  };

  const [aggregate, count] = await Promise.all([
    prisma.sensorReading.aggregate({
      where,
      _min: { value: true },
      _max: { value: true },
      _avg: { value: true },
    }),
    prisma.sensorReading.count({ where }),
  ]);

  return {
    count,
    min: aggregate._min.value,
    max: aggregate._max.value,
    avg: aggregate._avg.value,
  };
}

export async function getPointReadingsCount(pointId: string, range?: ReadingsRangeQuery) {
  await getPointOrThrow(pointId);

  const timestamp = buildTimestampFilter(range);
  const count = await prisma.sensorReading.count({
    where: {
      monitoringPointId: pointId,
      ...(timestamp ? { timestamp } : {}),
    },
  });

  return { count };
}

export async function getGlobalReadingsCount() {
  const count = await prisma.sensorReading.count();
  return { count };
}

export async function deleteReadings(pointId: string, range?: ReadingsRangeQuery) {
  await getPointOrThrow(pointId);

  const timestamp = buildTimestampFilter(range);
  const result = await prisma.sensorReading.deleteMany({
    where: {
      monitoringPointId: pointId,
      ...(timestamp ? { timestamp } : {}),
    },
  });

  return { deletedCount: result.count };
}

export async function forecastReadings(pointId: string, query: ForecastQuery) {
  const readings = await listReadings(pointId);

  if (readings.length < 2) {
    throw new AppError(
      400,
      'At least 2 readings are required to generate a forecast'
    );
  }

  const history = readings.map((reading) => ({
    timestampMs: new Date(reading.timestamp).getTime(),
    value: reading.value,
  }));

  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  const intervalMs = Math.max(1_000, last.timestampMs - prev.timestampMs);
  const predictions = forecastLinear(history, query.horizon, intervalMs);

  return {
    method: 'linear-regression' as const,
    horizon: query.horizon,
    intervalMs,
    historyCount: history.length,
    predictions,
  };
}
