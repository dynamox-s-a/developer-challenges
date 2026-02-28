import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import corsPlugin from '../../../src/shared/plugins/cors';
import { faker } from '@faker-js/faker';
import { ACCEPTED_CORS_METHODS } from '../../../src/auth/domain/auth.constants';

const DISALLOWED_METHODS = ['CONNECT', 'TRACE', 'HEAD'];

describe('CORS plugin', () => {
  let fastify: FastifyInstance;
  let originUrl: string;

  beforeEach(async () => {
    originUrl = faker.internet.url({ appendSlash: false });
    vi.stubEnv('CORS_ORIGIN', originUrl);

    fastify = Fastify({ logger: false });
    await fastify.register(corsPlugin);

    fastify.route({
      method: ACCEPTED_CORS_METHODS.filter((m) => m !== 'OPTIONS'),
      url: '/test',
      handler: async () => ({ ok: true }),
    });

    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
    vi.unstubAllEnvs();
  });

  test('should register without errors', async () => {
    await expect(fastify.ready()).resolves.not.toThrow();
  });

  describe('when receiving a preflight request', () => {
    test('should not include disallowed methods in access-control-allow-methods', async () => {
      const response = await fastify.inject({
        method: 'OPTIONS',
        url: '/test',
        headers: {
          origin: originUrl,
          'access-control-request-method': 'GET',
        },
      });

      const allowedMethods = response.headers['access-control-allow-methods'];
      DISALLOWED_METHODS.forEach((method) => expect(allowedMethods).not.toContain(method));
    });
  });

  describe('when receiving a request from the configured origin', () => {
    test.each(ACCEPTED_CORS_METHODS)(
      'should set CORS headers for %s',
      async (method) => {
        const response = await fastify.inject({
          method,
          url: '/test',
          headers: { origin: originUrl },
        });

        expect(response.headers['access-control-allow-origin']).toBe(originUrl);
        expect(response.headers['access-control-allow-credentials']).toBe('true');
      },
    );
  });
});
