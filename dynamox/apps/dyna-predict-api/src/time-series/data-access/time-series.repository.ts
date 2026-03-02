/**
 * @fileoverview Data access repository for the Time Series entity. Encapsulates all
 * database operations (reads and writes) and wraps Prisma errors into typed
 * application errors before propagating them up the stack.
 */

import type { FastifyInstance } from 'fastify';
import type { CreateTimeSeriesRequest } from '@dynamox/types';
import {
  INTERNAL_SERVER_ERROR,
  TIME_SERIES_ERR_DUPLICATE_TIMESTAMP,
  withCause,
} from '../../shared/errors/errors';

export async function createTimeSeriesEntries(
  fastify: FastifyInstance,
  sensorId: number,
  entries: CreateTimeSeriesRequest[],
) {
  try {
    return await fastify.prisma.timeSeries.createManyAndReturn({
      data: entries.map((entry) => ({
        sensorId,
        temperature: entry.temperature,
        accelerationRms: entry.accelerationRms,
        velocityRms: entry.velocityRms,
        ...(entry.timestamp ? { timestamp: new Date(entry.timestamp) } : {}),
      })),
      select: {
        uuid: true,
        temperature: true,
        accelerationRms: true,
        velocityRms: true,
        timestamp: true,
      },
    });
  } catch (error) {
    // NOTE (@eric-reis): P2002 is Prisma's unique constraint violation code.
    if ((error as { code?: string }).code === 'P2002') {
      throw new TIME_SERIES_ERR_DUPLICATE_TIMESTAMP();
    }
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function deleteAllTimeSeriesBySensor(
  fastify: FastifyInstance,
  sensorUuid: string,
  userId: number,
): Promise<number> {
  try {
    const result = await fastify.prisma.timeSeries.deleteMany({
      where: { sensor: { uuid: sensorUuid, monitoringPoint: { machine: { userId } } } },
    });

    return result.count;
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function findSensorByUuid(
  fastify: FastifyInstance,
  sensorUuid: string,
  userId: number,
) {
  try {
    return await fastify.prisma.sensor.findFirst({
      where: { uuid: sensorUuid, monitoringPoint: { machine: { userId } } },
      select: { id: true },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function getTimeSeriesMetrics(
  fastify: FastifyInstance,
  sensorUuid: string,
  userId: number,
  dateRange: { gte: Date; lte: Date },
) {
  try {
    return await fastify.prisma.timeSeries.aggregate({
      where: {
        sensor: { uuid: sensorUuid, monitoringPoint: { machine: { userId } } },
        timestamp: { gte: dateRange.gte, lte: dateRange.lte },
      },
      _avg: { temperature: true, accelerationRms: true, velocityRms: true },
      _max: { temperature: true, accelerationRms: true, velocityRms: true },
      _min: { temperature: true, accelerationRms: true, velocityRms: true },
      _count: true,
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function getTimeSeriesBySensor(
  fastify: FastifyInstance,
  sensorUuid: string,
  userId: number,
  dateRange: { gte: Date; lte: Date },
) {
  try {
    return await fastify.prisma.timeSeries.findMany({
      where: {
        sensor: { uuid: sensorUuid, monitoringPoint: { machine: { userId } } },
        timestamp: { gte: dateRange.gte, lte: dateRange.lte },
      },
      select: {
        uuid: true,
        temperature: true,
        accelerationRms: true,
        velocityRms: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'asc' },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}
