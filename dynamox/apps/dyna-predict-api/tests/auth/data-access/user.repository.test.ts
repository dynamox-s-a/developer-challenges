import { describe, expect, vi } from 'vitest';
import { repositoryTest as test } from '../../fixtures/fastify.fixture';
import { findUserByEmail, findUserById } from '../../../src/auth/data-access/user.repository';
import { INTERNAL_SERVER_ERROR } from '../../../src/shared/errors/errors';

describe('user repository', () => {
  describe('findUserByEmail', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.user = { findUnique: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await findUserByEmail(fastify, fake.email).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.user.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when user is not found', () => {
      test('should return null', async ({ fastify, fake }) => {
        fastify.prisma.user = { findUnique: vi.fn().mockResolvedValue(null) };

        const result = await findUserByEmail(fastify, fake.email);

        expect(result).toBeNull();

        expect(fastify.prisma.user.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when user is found', () => {
      test('should return the user', async ({ fastify, fake }) => {
        const mockResult = {
          id: fake.userId,
          uuid: fake.uuid,
          email: fake.email,
          name: fake.name,
          password: fake.password,
          role: 'USER',
        };

        fastify.prisma.user = { findUnique: vi.fn().mockResolvedValue(mockResult) };

        const result = await findUserByEmail(fastify, fake.email);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.user.findUnique).toHaveBeenCalledWith({
          where: { email: fake.email },
          select: expect.objectContaining({ email: true }),
        });
      });
    });
  });

  describe('findUserById', () => {
    describe('when Prisma throws an error', () => {
      test('should rethrow as INTERNAL_SERVER_ERROR with cause', async ({ fastify, fake }) => {
        fastify.prisma.user = { findUnique: vi.fn().mockRejectedValue(fake.dbError) };

        const thrownError = await findUserById(fastify, fake.userId).catch((error) => error);

        expect(thrownError).toBeInstanceOf(INTERNAL_SERVER_ERROR);
        expect(thrownError.cause).toBe(fake.dbError);

        expect(fastify.prisma.user.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when user is not found', () => {
      test('should return null', async ({ fastify, fake }) => {
        fastify.prisma.user = { findUnique: vi.fn().mockResolvedValue(null) };

        const result = await findUserById(fastify, fake.userId);

        expect(result).toBeNull();

        expect(fastify.prisma.user.findUnique).toHaveBeenCalledOnce();
      });
    });

    describe('when user is found', () => {
      test('should return the user', async ({ fastify, fake }) => {
        const mockResult = {
          id: fake.userId,
          uuid: fake.uuid,
          email: fake.email,
          name: fake.name,
          role: 'USER',
        };

        fastify.prisma.user = { findUnique: vi.fn().mockResolvedValue(mockResult) };

        const result = await findUserById(fastify, fake.userId);

        expect(result).toEqual(mockResult);

        expect(fastify.prisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: fake.userId },
          select: expect.objectContaining({ id: true }),
        });
      });
    });
  });
});
