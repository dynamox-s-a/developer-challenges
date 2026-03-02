import { describe, expect, it, vi } from 'vitest';
import { monitoringPointTest as test } from '../../fixtures/monitoring-point.fixture';
import {
  buildOrderBy,
  getPaginatedMonitoringPoints,
  findMonitoringPointByUuid,
  findExistingMonitoringPoint,
  createMonitoringPoint,
  updateMonitoringPoint,
  deleteMonitoringPointSensor,
  deleteMonitoringPoint,
} from '../../../src/monitoring-points/data-access/monitoring-points.repository';
import { INTERNAL_SERVER_ERROR } from '../../../src/shared/errors/errors';

describe('monitoring points repository', () => {
  describe('buildOrderBy', () => {
    const cases = {
      name:        (order: string) => ({ name: order }),
      machineName: (order: string) => ({ machine: { name: order } }),
      machineType: (order: string) => ({ machine: { type: order } }),
      sensorModel: (order: string) => ({ sensor: { model: order } }),
    };

    const entries = Object.entries(cases) as [keyof typeof cases, (order: string) => object][];

    describe('with order "asc"', () => {
      entries.forEach(([sortBy, expectedOrderBy]) => {
        it(`should return correct orderBy for "${sortBy}"`, () => {
          expect(buildOrderBy(sortBy, 'asc')).toEqual(expectedOrderBy('asc'));
        });
      });
    });

    describe('with order "desc"', () => {
      entries.forEach(([sortBy, expectedOrderBy]) => {
        it(`should return correct orderBy for "${sortBy}"`, () => {
          expect(buildOrderBy(sortBy, 'desc')).toEqual(expectedOrderBy('desc'));
        });
      });
    });
  });

  describe('getPaginatedMonitoringPoints', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = {
          findMany: vi.fn().mockRejectedValue(fake.dbError),
          count: vi.fn().mockResolvedValue(0),
        };

        const thrownError = await getPaginatedMonitoringPoints(fastify, fake.userId, 1, 5).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.monitoringPoint.findMany).toHaveBeenCalledOnce();
      });
    });

    describe('when monitoring points are found', () => {
      test('should return paginated results with correct metadata', async ({ fastify, fake }) => {
        const mockItem = { id: fake.id, uuid: fake.uuid, name: fake.name };

        fastify.prisma.monitoringPoint = {
          findMany: vi.fn().mockResolvedValue([mockItem]),
          count: vi.fn().mockResolvedValue(10),
        };

        const result = await getPaginatedMonitoringPoints(fastify, fake.userId, 1, 5);

        expect(result).toEqual({
          monitoringPoints: [mockItem],
          pagination: {
            currentPage: 1,
            pageSize: 5,
            totalPages: 2,
            totalElements: 10,
            hasNextPage: true,
          },
        });

        expect(fastify.prisma.monitoringPoint.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { machine: { userId: fake.userId } },
            skip: 0,
            take: 5,
          }),
        );

        expect(fastify.prisma.monitoringPoint.count).toHaveBeenCalledWith({
          where: { machine: { userId: fake.userId } },
        });
      });
    });
  });

  describe('findMonitoringPointByUuid', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { findFirst: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await findMonitoringPointByUuid(fastify, fake.uuid, fake.userId).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.monitoringPoint.findFirst).toHaveBeenCalledOnce();
      });
    });

    describe('when monitoring point is not found', () => {
      test('should return null', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { findFirst: vi.fn().mockResolvedValue(null) };

        const result = await findMonitoringPointByUuid(fastify, fake.uuid, fake.userId);

        expect(result).toBeNull();

        expect(fastify.prisma.monitoringPoint.findFirst).toHaveBeenCalledOnce();
      });
    });

    describe('when monitoring point is found', () => {
      test('should return the monitoring point', async ({ fastify, fake }) => {
        const mockResult = { id: fake.id, name: fake.name, machine: { id: fake.id, type: 'Pump' } };

        fastify.prisma.monitoringPoint = { findFirst: vi.fn().mockResolvedValue(mockResult) };

        const result = await findMonitoringPointByUuid(fastify, fake.uuid, fake.userId);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.monitoringPoint.findFirst).toHaveBeenCalledWith(
          expect.objectContaining({ where: { uuid: fake.uuid, machine: { userId: fake.userId } } }),
        );
      });
    });
  });

  describe('findExistingMonitoringPoint', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { findUnique: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await findExistingMonitoringPoint(fastify, fake.name, fake.id).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.monitoringPoint.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when monitoring point is not found', () => {
      test('should return null', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { findUnique: vi.fn().mockResolvedValue(null) };

        const result = await findExistingMonitoringPoint(fastify, fake.name, fake.id);

        expect(result).toBeNull();

        expect(fastify.prisma.monitoringPoint.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when monitoring point is found', () => {
      test('should return the monitoring point', async ({ fastify, fake }) => {
        const mockResult = { id: fake.id };

        fastify.prisma.monitoringPoint = { findUnique: vi.fn().mockResolvedValue(mockResult) };

        const result = await findExistingMonitoringPoint(fastify, fake.name, fake.id);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.monitoringPoint.findUnique).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { machineId_name: { machineId: fake.id, name: fake.name } },
          }),
        );
      });
    });
  });

  describe('createMonitoringPoint', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { create: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await createMonitoringPoint(fastify, fake.name, fake.id).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.monitoringPoint.create).toHaveBeenCalledOnce();
      });
    });

    describe('when created without a sensor', () => {
      test('should create without sensor data', async ({ fastify, fake, mockMonitoringPointWithoutSensor }) => {
        fastify.prisma.monitoringPoint = { create: vi.fn().mockResolvedValue(mockMonitoringPointWithoutSensor) };

        const result = await createMonitoringPoint(fastify, fake.name, fake.id);

        expect(result).toEqual(mockMonitoringPointWithoutSensor);

        expect(fastify.prisma.monitoringPoint.create).toHaveBeenCalledWith(
          expect.objectContaining({ data: { name: fake.name, machineId: fake.id } }),
        );
      });
    });

    describe('when created with a sensor', () => {
      test('should create with sensor data', async ({ fastify, fake, mockMonitoringPoint }) => {
        fastify.prisma.monitoringPoint = { create: vi.fn().mockResolvedValue(mockMonitoringPoint) };

        const result = await createMonitoringPoint(fastify, fake.name, fake.id, mockMonitoringPoint.sensor.model);

        expect(result).toEqual(mockMonitoringPoint);

        expect(fastify.prisma.monitoringPoint.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: {
              name: fake.name,
              machineId: fake.id,
              sensor: { create: { model: mockMonitoringPoint.sensor.model } },
            },
          }),
        );
      });
    });
  });

  describe('updateMonitoringPoint', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { update: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await updateMonitoringPoint(fastify, fake.uuid, fake.name).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.monitoringPoint.update).toHaveBeenCalledOnce();
      });
    });

    describe('when updated without a sensor', () => {
      test('should update without sensor data', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { update: vi.fn().mockResolvedValue({}) };

        await updateMonitoringPoint(fastify, fake.uuid, fake.name);

        expect(fastify.prisma.monitoringPoint.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { uuid: fake.uuid },
            data: { name: fake.name },
          }),
        );
      });
    });

    describe('when updated with a sensor', () => {
      test('should upsert sensor data', async ({ fastify, fake }) => {
        const sensorModel = 'TcAg';

        fastify.prisma.monitoringPoint = { update: vi.fn().mockResolvedValue({}) };

        await updateMonitoringPoint(fastify, fake.uuid, fake.name, sensorModel);

        expect(fastify.prisma.monitoringPoint.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { uuid: fake.uuid },
            data: {
              name: fake.name,
              sensor: {
                upsert: { create: { model: sensorModel }, update: { model: sensorModel } },
              },
            },
          }),
        );
      });
    });
  });

  describe('deleteMonitoringPointSensor', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.sensor = { deleteMany: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await deleteMonitoringPointSensor(fastify, fake.uuid).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.sensor.deleteMany).toHaveBeenCalledOnce();
      });
    });

    describe('when sensor is deleted', () => {
      test('should call deleteMany with the correct filter', async ({ fastify, fake }) => {
        fastify.prisma.sensor = { deleteMany: vi.fn().mockResolvedValue(undefined) };

        await deleteMonitoringPointSensor(fastify, fake.uuid);

        expect(fastify.prisma.sensor.deleteMany).toHaveBeenCalledWith({
          where: { monitoringPoint: { uuid: fake.uuid } },
        });
      });
    });
  });

  describe('deleteMonitoringPoint', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { delete: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await deleteMonitoringPoint(fastify, fake.uuid).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.monitoringPoint.delete).toHaveBeenCalledOnce();
      });
    });

    describe('when monitoring point is deleted', () => {
      test('should call delete with the correct uuid', async ({ fastify, fake }) => {
        fastify.prisma.monitoringPoint = { delete: vi.fn().mockResolvedValue(undefined) };

        await deleteMonitoringPoint(fastify, fake.uuid);

        expect(fastify.prisma.monitoringPoint.delete).toHaveBeenCalledWith({
          where: { uuid: fake.uuid },
        });
      });
    });
  });
});
