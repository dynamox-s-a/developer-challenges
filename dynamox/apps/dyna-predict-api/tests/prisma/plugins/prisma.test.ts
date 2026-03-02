import { describe, it, expect, vi, beforeEach } from 'vitest';
import Fastify from 'fastify';

const { mockConnect, mockDisconnect, mockQueryRaw, mockOn } = vi.hoisted(() => ({
  mockConnect: vi.fn().mockResolvedValue(undefined),
  mockDisconnect: vi.fn().mockResolvedValue(undefined),
  mockQueryRaw: vi.fn().mockResolvedValue([]),
  mockOn: vi.fn(),
}));

vi.mock('../../../src/prisma/generated/client', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrismaClient: vi.fn(function (this: any) {
    this.$connect = mockConnect;
    this.$disconnect = mockDisconnect;
    this.$queryRaw = mockQueryRaw;
    this.$on = mockOn;
  }),
}));

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(),
}));

import prismaPlugin from '../../../src/prisma/plugins/prisma';
import { PrismaClient } from '../../../src/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

describe('prisma plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/testdb');
  });

  describe('without DB metrics', () => {
    it('should connect, decorate fastify, run warmup query and disconnect on close', async () => {
      const fastify = Fastify({ logger: false });

      await fastify.register(prismaPlugin);
      await fastify.ready();

      expect(PrismaPg).toHaveBeenCalledExactlyOnceWith({
        connectionString: 'postgresql://test:test@localhost:5432/testdb',
      });
      expect(PrismaClient).toHaveBeenCalledExactlyOnceWith({
        adapter: expect.any(Object),
        log: [],
      });
      expect(mockConnect).toHaveBeenCalledOnce();
      expect(mockOn).not.toHaveBeenCalled();
      expect(fastify.prisma).toBeDefined();
      expect(mockQueryRaw).toHaveBeenCalledOnce();

      await fastify.close();

      expect(mockDisconnect).toHaveBeenCalledOnce();
    });
  });

  describe('with DB metrics and without query SQL logging', () => {
    it('should register a query event listener and log only the duration', async () => {
      vi.stubEnv('TRACK_DB_METRICS', 'true');

      const fastify = Fastify({ logger: false });
      const logInfoSpy = vi.spyOn(fastify.log, 'info');

      await fastify.register(prismaPlugin);
      await fastify.ready();

      expect(PrismaClient).toHaveBeenCalledExactlyOnceWith({
        adapter: expect.any(Object),
        log: [{ emit: 'event', level: 'query' }],
      });
      expect(mockOn).toHaveBeenCalledExactlyOnceWith('query', expect.any(Function));

      const [[, queryCallback]] = mockOn.mock.calls;
      queryCallback({ query: 'SELECT 1', duration: 1.5 });

      expect(logInfoSpy).toHaveBeenCalledWith({ duration: '1.500ms' }, 'Prisma query metrics:');

      await fastify.close();
    });
  });

  describe('with DB metrics and query SQL logging enabled', () => {
    it('should log both query and duration', async () => {
      vi.stubEnv('TRACK_DB_METRICS', 'true');
      vi.stubEnv('TRACK_DB_QUERY_SQL', 'true');

      const fastify = Fastify({ logger: false });
      const logInfoSpy = vi.spyOn(fastify.log, 'info');

      await fastify.register(prismaPlugin);
      await fastify.ready();

      const [[, queryCallback]] = mockOn.mock.calls;
      queryCallback({ query: 'SELECT 1', duration: 1.5 });

      expect(logInfoSpy).toHaveBeenCalledWith(
        { query: 'SELECT 1', duration: '1.500ms' },
        'Prisma query metrics:',
      );

      await fastify.close();
    });
  });
});
