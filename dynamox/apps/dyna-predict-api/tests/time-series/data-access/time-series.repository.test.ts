import { describe, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { timeSeriesTest as test } from '../../fixtures/time-series.fixture';
import {
  createTimeSeriesEntries,
  deleteAllTimeSeriesBySensor,
  findSensorByUuid,
  getTimeSeriesMetrics,
  getTimeSeriesBySensor,
} from '../../../src/time-series/data-access/time-series.repository';
import {
  INTERNAL_SERVER_ERROR,
  TIME_SERIES_ERR_DUPLICATE_TIMESTAMP,
} from '../../../src/shared/errors/errors';

const dateRange = {
  gte: dayjs().subtract(1, 'day').toDate(),
  lte: dayjs().toDate(),
};

describe('time series repository', () => {
  describe('createTimeSeriesEntries', () => {
    describe('when Prisma throws a duplicate timestamp error (P2002)', () => {
      test('should throw TIME_SERIES_ERR_DUPLICATE_TIMESTAMP', async ({ fastify, fake }) => {
        const p2002Error = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' });
        fastify.prisma.timeSeries = { createManyAndReturn: vi.fn().mockRejectedValue(p2002Error) };

        const thrownError = await createTimeSeriesEntries(fastify, fake.id, []).catch((error) => error);

        expect(thrownError).toBeInstanceOf(TIME_SERIES_ERR_DUPLICATE_TIMESTAMP);

        expect(fastify.prisma.timeSeries.createManyAndReturn).toHaveBeenCalledOnce();
      });
    });

    describe('when Prisma throws a generic error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.timeSeries = { createManyAndReturn: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await createTimeSeriesEntries(fastify, fake.id, []).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.timeSeries.createManyAndReturn).toHaveBeenCalledOnce();
      });
    });

    describe('when entries are created without a timestamp', () => {
      test('should call createManyAndReturn without the timestamp field', async ({ fastify, fake, mockTimeSeriesEntry }) => {
        const entry = {
          temperature: mockTimeSeriesEntry.temperature,
          accelerationRms: mockTimeSeriesEntry.accelerationRms,
          velocityRms: mockTimeSeriesEntry.velocityRms,
        };
        const mockResult = [mockTimeSeriesEntry];
        const expectedResult = structuredClone(mockResult);

        fastify.prisma.timeSeries = { createManyAndReturn: vi.fn().mockResolvedValue(mockResult) };

        const result = await createTimeSeriesEntries(fastify, fake.id, [entry]);

        expect(result).toEqual(expectedResult);

        expect(fastify.prisma.timeSeries.createManyAndReturn).toHaveBeenCalledWith(
          expect.objectContaining({
            data: [{
              sensorId: fake.id,
              temperature: entry.temperature,
              accelerationRms: entry.accelerationRms,
              velocityRms: entry.velocityRms,
            }],
          }),
        );
      });
    });

    describe('when entries are created with a timestamp', () => {
      test('should call createManyAndReturn with timestamp as Date', async ({ fastify, fake, mockTimeSeriesEntry }) => {
        const timestamp = dayjs(mockTimeSeriesEntry.timestamp).toISOString();
        const entry = {
          temperature: mockTimeSeriesEntry.temperature,
          accelerationRms: mockTimeSeriesEntry.accelerationRms,
          velocityRms: mockTimeSeriesEntry.velocityRms,
          timestamp,
        };
        const mockResult = [mockTimeSeriesEntry];
        const expectedResult = structuredClone(mockResult);

        fastify.prisma.timeSeries = { createManyAndReturn: vi.fn().mockResolvedValue(mockResult) };

        const result = await createTimeSeriesEntries(fastify, fake.id, [entry]);

        expect(result).toEqual(expectedResult);

        expect(fastify.prisma.timeSeries.createManyAndReturn).toHaveBeenCalledWith(
          expect.objectContaining({
            data: [{
              sensorId: fake.id,
              temperature: entry.temperature,
              accelerationRms: entry.accelerationRms,
              velocityRms: entry.velocityRms,
              timestamp: dayjs(timestamp).toDate(),
            }],
          }),
        );
      });
    });
  });

  describe('deleteAllTimeSeriesBySensor', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.timeSeries = { deleteMany: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await deleteAllTimeSeriesBySensor(fastify, fake.uuid, fake.userId).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.timeSeries.deleteMany).toHaveBeenCalledOnce();
      });
    });

    describe('when time series are deleted', () => {
      test('should call deleteMany with correct filter and return count', async ({ fastify, fake }) => {
        const count = faker.number.int({ min: 1, max: 100 });
        fastify.prisma.timeSeries = { deleteMany: vi.fn().mockResolvedValue({ count }) };

        const result = await deleteAllTimeSeriesBySensor(fastify, fake.uuid, fake.userId);

        expect(result).toBe(count);

        expect(fastify.prisma.timeSeries.deleteMany).toHaveBeenCalledWith({
          where: { sensor: { uuid: fake.uuid, monitoringPoint: { machine: { userId: fake.userId } } } },
        });
      });
    });
  });

  describe('findSensorByUuid', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.sensor = { findFirst: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await findSensorByUuid(fastify, fake.uuid, fake.userId).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.sensor.findFirst).toHaveBeenCalledOnce();
      });
    });

    describe('when sensor is not found', () => {
      test('should return null', async ({ fastify, fake }) => {
        fastify.prisma.sensor = { findFirst: vi.fn().mockResolvedValue(null) };

        const result = await findSensorByUuid(fastify, fake.uuid, fake.userId);

        expect(result).toBeNull();

        expect(fastify.prisma.sensor.findFirst).toHaveBeenCalledOnce();
      });
    });

    describe('when sensor is found', () => {
      test('should return sensor with id', async ({ fastify, fake }) => {
        const mockSensor = { id: fake.id };
        const expectedResult = structuredClone(mockSensor);

        fastify.prisma.sensor = { findFirst: vi.fn().mockResolvedValue(mockSensor) };

        const result = await findSensorByUuid(fastify, fake.uuid, fake.userId);

        expect(result).toEqual(expectedResult);

        expect(fastify.prisma.sensor.findFirst).toHaveBeenCalledWith({
          where: { uuid: fake.uuid, monitoringPoint: { machine: { userId: fake.userId } } },
          select: { id: true },
        });
      });
    });
  });

  describe('getTimeSeriesMetrics', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.timeSeries = { aggregate: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await getTimeSeriesMetrics(fastify, fake.uuid, fake.userId, dateRange).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.timeSeries.aggregate).toHaveBeenCalledOnce();
      });
    });

    describe('when there are no time series records', () => {
      test('should return aggregate with null values and zero count', async ({ fastify, fake }) => {
        const mockResult = {
          _avg: { temperature: null, accelerationRms: null, velocityRms: null },
          _max: { temperature: null, accelerationRms: null, velocityRms: null },
          _min: { temperature: null, accelerationRms: null, velocityRms: null },
          _count: 0,
        };
        const expectedResult = structuredClone(mockResult);

        fastify.prisma.timeSeries = { aggregate: vi.fn().mockResolvedValue(mockResult) };

        const result = await getTimeSeriesMetrics(fastify, fake.uuid, fake.userId, dateRange);

        expect(result).toEqual(expectedResult);

        expect(fastify.prisma.timeSeries.aggregate).toHaveBeenCalledOnce();
      });
    });

    describe('when metrics are returned', () => {
      test('should return the aggregate result', async ({ fastify, fake, mockTimeSeriesMetrics }) => {
        const expectedResult = structuredClone(mockTimeSeriesMetrics);

        fastify.prisma.timeSeries = { aggregate: vi.fn().mockResolvedValue(mockTimeSeriesMetrics) };

        const result = await getTimeSeriesMetrics(fastify, fake.uuid, fake.userId, dateRange);

        expect(result).toEqual(expectedResult);

        expect(fastify.prisma.timeSeries.aggregate).toHaveBeenCalledWith({
          where: {
            sensor: { uuid: fake.uuid, monitoringPoint: { machine: { userId: fake.userId } } },
            timestamp: { gte: dateRange.gte, lte: dateRange.lte },
          },
          _avg: { temperature: true, accelerationRms: true, velocityRms: true },
          _max: { temperature: true, accelerationRms: true, velocityRms: true },
          _min: { temperature: true, accelerationRms: true, velocityRms: true },
          _count: true,
        });
      });
    });
  });

  describe('getTimeSeriesBySensor', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.timeSeries = { findMany: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await getTimeSeriesBySensor(fastify, fake.uuid, fake.userId, dateRange).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.timeSeries.findMany).toHaveBeenCalledOnce();
      });
    });

    describe('when there are no time series records', () => {
      test('should return an empty array', async ({ fastify, fake }) => {
        fastify.prisma.timeSeries = { findMany: vi.fn().mockResolvedValue([]) };

        const result = await getTimeSeriesBySensor(fastify, fake.uuid, fake.userId, dateRange);

        expect(result).toEqual([]);

        expect(fastify.prisma.timeSeries.findMany).toHaveBeenCalledOnce();
      });
    });

    describe('when time series are found', () => {
      test('should return entries ordered by timestamp', async ({ fastify, fake, mockTimeSeriesEntry }) => {
        const mockResult = [mockTimeSeriesEntry];
        const expectedResult = structuredClone(mockResult);

        fastify.prisma.timeSeries = { findMany: vi.fn().mockResolvedValue(mockResult) };

        const result = await getTimeSeriesBySensor(fastify, fake.uuid, fake.userId, dateRange);

        expect(result).toEqual(expectedResult);

        expect(fastify.prisma.timeSeries.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              sensor: { uuid: fake.uuid, monitoringPoint: { machine: { userId: fake.userId } } },
              timestamp: { gte: dateRange.gte, lte: dateRange.lte },
            },
            orderBy: { timestamp: 'asc' },
          }),
        );
      });
    });
  });
});
