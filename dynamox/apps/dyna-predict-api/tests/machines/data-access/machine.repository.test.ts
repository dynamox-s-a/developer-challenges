import { afterEach, describe, expect, vi } from 'vitest';
import { repositoryTest as test } from '../../fixtures/fastify.fixture';
import {
  getMachines,
  findExistingMachine,
  findExistingMachineByUuid,
  createMachine,
  updateMachine,
  deleteMachine,
} from '../../../src/machines/data-access/machine.repository';
import { INTERNAL_SERVER_ERROR } from '../../../src/shared/errors/errors';

describe('machine repository', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getMachines', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.machine = { findMany: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await getMachines(fastify, fake.userId).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.machine.findMany).toHaveBeenCalledOnce();
      });
    });

    describe('when no machines are found', () => {
      test('should return an empty array', async ({ fastify, fake }) => {
        fastify.prisma.machine = { findMany: vi.fn().mockResolvedValue([]) };

        const result = await getMachines(fastify, fake.userId);

        expect(result).toEqual([]);

        expect(fastify.prisma.machine.findMany).toHaveBeenCalledOnce();
      });
    });

    describe('when machines are found', () => {
      test('should return the list', async ({ fastify, fake }) => {
        const mockResult = [
          { id: fake.id, uuid: fake.uuid, name: fake.name, type: 'PUMP', userId: fake.userId },
        ];

        fastify.prisma.machine = { findMany: vi.fn().mockResolvedValue(mockResult) };

        const result = await getMachines(fastify, fake.userId);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.machine.findMany).toHaveBeenCalledWith(
          expect.objectContaining({ where: { userId: fake.userId } }),
        );
      });
    });
  });

  describe('findExistingMachine', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.machine = { findFirst: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await findExistingMachine(
          fastify,
          fake.name,
          'PUMP',
          fake.userId,
        ).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.machine.findFirst).toHaveBeenCalledOnce();
      });
    });

    describe('when machine is not found', () => {
      test('should return null', async ({ fastify, fake }) => {
        fastify.prisma.machine = { findFirst: vi.fn().mockResolvedValue(null) };

        const result = await findExistingMachine(fastify, fake.name, 'PUMP', fake.userId);

        expect(result).toBeNull();

        expect(fastify.prisma.machine.findFirst).toHaveBeenCalledOnce();
      });
    });

    describe('when machine is found', () => {
      test('should return the machine', async ({ fastify, fake }) => {
        const mockResult = { id: fake.id };

        fastify.prisma.machine = { findFirst: vi.fn().mockResolvedValue(mockResult) };

        const result = await findExistingMachine(fastify, fake.name, 'PUMP', fake.userId);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.machine.findFirst).toHaveBeenCalledOnce();
      });
    });
  });

  describe('findExistingMachineByUuid', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.machine = { findUnique: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await findExistingMachineByUuid(fastify, fake.uuid, fake.userId).catch(
          (error) => error,
        );

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.machine.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when machine is not found', () => {
      test('should return null', async ({ fastify, fake }) => {
        fastify.prisma.machine = { findUnique: vi.fn().mockResolvedValue(null) };

        const result = await findExistingMachineByUuid(fastify, fake.uuid, fake.userId);

        expect(result).toBeNull();

        expect(fastify.prisma.machine.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when machine is found', () => {
      test('should return the machine', async ({ fastify, fake }) => {
        const mockResult = { id: fake.id, uuid: fake.uuid, name: fake.name, type: 'PUMP' };

        fastify.prisma.machine = { findUnique: vi.fn().mockResolvedValue(mockResult) };

        const result = await findExistingMachineByUuid(fastify, fake.uuid, fake.userId);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.machine.findUnique).toHaveBeenCalledWith(
          expect.objectContaining({ where: { uuid: fake.uuid, userId: fake.userId } }),
        );
      });
    });
  });

  describe('createMachine', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.machine = { create: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await createMachine(fastify, fake.name, 'PUMP', fake.userId).catch(
          (error) => error,
        );

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.machine.create).toHaveBeenCalledOnce();
      });
    });

    describe('when machine is created', () => {
      test('should return the created machine', async ({ fastify, fake }) => {
        const type = 'PUMP';
        const mockResult = {
          id: fake.id,
          uuid: fake.uuid,
          name: fake.name,
          type,
          userId: fake.userId,
        };

        fastify.prisma.machine = { create: vi.fn().mockResolvedValue(mockResult) };

        const result = await createMachine(fastify, fake.name, type, fake.userId);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.machine.create).toHaveBeenCalledWith({
          data: { name: fake.name, type, userId: fake.userId },
        });
      });
    });
  });

  describe('updateMachine', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.machine = { update: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await updateMachine(fastify, fake.uuid, fake.userId, fake.name).catch(
          (error) => error,
        );

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.machine.update).toHaveBeenCalledOnce();
      });
    });

    describe('when both name and type are provided', () => {
      test('should update both fields', async ({ fastify, fake }) => {
        const type = 'FAN';

        fastify.prisma.machine = { update: vi.fn().mockResolvedValue({}) };

        await updateMachine(fastify, fake.uuid, fake.userId, fake.name, type);

        expect(fastify.prisma.machine.update).toHaveBeenCalledWith({
          where: { uuid: fake.uuid, userId: fake.userId },
          data: { name: fake.name, type },
        });
      });
    });

    describe('when only name is provided', () => {
      test('should update only name', async ({ fastify, fake }) => {
        fastify.prisma.machine = { update: vi.fn().mockResolvedValue({}) };

        await updateMachine(fastify, fake.uuid, fake.userId, fake.name);

        expect(fastify.prisma.machine.update).toHaveBeenCalledWith({
          where: { uuid: fake.uuid, userId: fake.userId },
          data: { name: fake.name },
        });
      });
    });
  });

  describe('deleteMachine', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.machine = { delete: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await deleteMachine(fastify, fake.uuid).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.machine.delete).toHaveBeenCalledOnce();
      });
    });

    describe('when machine is deleted', () => {
      test('should return the deleted machine', async ({ fastify, fake }) => {
        const mockResult = { id: fake.id, uuid: fake.uuid };

        fastify.prisma.machine = { delete: vi.fn().mockResolvedValue(mockResult) };

        const result = await deleteMachine(fastify, fake.uuid);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.machine.delete).toHaveBeenCalledWith({ where: { uuid: fake.uuid } });
      });
    });
  });
});
