import { describe, expect, vi } from 'vitest';
import { repositoryTest as test } from '../../fixtures/fastify.fixture';
import { getDashboardMetrics } from '../../../src/reports/data-access/reports.repository';
import { INTERNAL_SERVER_ERROR } from '../../../src/shared/errors/errors';

describe('reports repository', () => {
  describe('getDashboardMetrics', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.machine = { count: vi.fn().mockRejectedValue(fake.dbError), groupBy: vi.fn() };
        fastify.prisma.monitoringPoint = { count: vi.fn() };
        fastify.prisma.sensor = { count: vi.fn(), groupBy: vi.fn() };
        fastify.prisma.timeSeries = { count: vi.fn() };

        const thrownError = await getDashboardMetrics(fastify, fake.userId).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);
      });
    });

    describe('when all queries succeed', () => {
      test('should return aggregated dashboard metrics', async ({ fastify, fake }) => {
        const machinesByType = [{ type: 'Pump', _count: { type: 2 } }];
        const sensorDistribution = [{ model: 'HFPlus', _count: { model: 1 } }];

        fastify.prisma.machine = {
          count: vi.fn().mockResolvedValue(3),
          groupBy: vi.fn().mockResolvedValue(machinesByType),
        };
        fastify.prisma.monitoringPoint = { count: vi.fn().mockResolvedValue(5) };
        fastify.prisma.sensor = {
          count: vi.fn().mockResolvedValue(4),
          groupBy: vi.fn().mockResolvedValue(sensorDistribution),
        };
        fastify.prisma.timeSeries = { count: vi.fn().mockResolvedValue(100) };

        const result = await getDashboardMetrics(fastify, fake.userId);

        expect(result).toEqual({
          machineCount: 3,
          monitoringPointCount: 5,
          assignedSensorCount: 4,
          timeSeriesRecordCount: 100,
          machinesByType,
          sensorDistribution,
        });

        expect(fastify.prisma.machine.count).toHaveBeenCalledWith({ where: { userId: fake.userId } });
        expect(fastify.prisma.monitoringPoint.count).toHaveBeenCalledWith({ where: { machine: { userId: fake.userId } } });
        expect(fastify.prisma.sensor.count).toHaveBeenCalledWith({ where: { monitoringPoint: { machine: { userId: fake.userId } } } });
        expect(fastify.prisma.timeSeries.count).toHaveBeenCalledWith({ where: { sensor: { monitoringPoint: { machine: { userId: fake.userId } } } } });
        expect(fastify.prisma.machine.groupBy).toHaveBeenCalledWith({
          by: ['type'],
          where: { userId: fake.userId },
          _count: { type: true },
        });
        expect(fastify.prisma.sensor.groupBy).toHaveBeenCalledWith({
          by: ['model'],
          where: { monitoringPoint: { machine: { userId: fake.userId } } },
          _count: { model: true },
        });
      });
    });
  });
});
