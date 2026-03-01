/**
 * @fileoverview Data access repository for reports. Aggregates metrics across entities
 * (machines, monitoring points, sensors, time-series) scoped to a given user.
 */

import type { FastifyInstance } from 'fastify';
import { INTERNAL_SERVER_ERROR, withCause } from '../../shared/errors/errors';

export async function getDashboardMetrics(
  fastify: FastifyInstance,
  userId: number,
) {
  try {
    const [
      machineCount,
      monitoringPointCount,
      assignedSensorCount,
      timeSeriesRecordCount,
      machinesByType,
      sensorDistribution,
    ] = await Promise.all([
      fastify.prisma.machine.count({ where: { userId } }),
      fastify.prisma.monitoringPoint.count({ where: { machine: { userId } } }),
      fastify.prisma.sensor.count({ where: { monitoringPoint: { machine: { userId } } } }),
      fastify.prisma.timeSeries.count({
        where: { sensor: { monitoringPoint: { machine: { userId } } } },
      }),
      fastify.prisma.machine.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true },
      }),
      fastify.prisma.sensor.groupBy({
        by: ['model'],
        where: { monitoringPoint: { machine: { userId } } },
        _count: { model: true },
      }),
    ]);

    return {
      machineCount,
      monitoringPointCount,
      assignedSensorCount,
      timeSeriesRecordCount,
      machinesByType,
      sensorDistribution,
    };
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}
