import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import cookiePlugin from '../../../src/auth/plugins/cookie';

describe('cookie plugin', () => {
  let fastify: FastifyInstance;

  beforeEach(() => {
    fastify = Fastify({ logger: false });
  });

  afterEach(async () => {
    await fastify.close();
    vi.unstubAllEnvs();
  });

  describe('when COOKIE_SECRET is not set', () => {
    test('should register without errors', async () => {
      await fastify.register(cookiePlugin);
      await expect(fastify.ready()).resolves.not.toThrow();
    });
  });

  describe('when COOKIE_SECRET is set', () => {
    beforeEach(() => {
      vi.stubEnv('COOKIE_SECRET', faker.string.alphanumeric(32));
    });

    test('should sign and verify cookies correctly', async () => {
      await fastify.register(cookiePlugin);
      await fastify.ready();

      const cookieValue = faker.string.alphanumeric(16);
      const signed = fastify.signCookie(cookieValue);

      const result = fastify.unsignCookie(signed);

      expect(result.value).toBe(cookieValue);
      expect(result.valid).toBe(true);
    });
  });
});
