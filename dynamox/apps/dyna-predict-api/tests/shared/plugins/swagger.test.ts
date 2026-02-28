import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import Fastify, { type FastifyInstance } from 'fastify';
import swaggerPlugin from '../../../src/shared/plugins/swagger';

async function buildSwaggerApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: false });
  await fastify.register(swaggerPlugin);
  await fastify.ready();
  return fastify;
}

describe('swagger plugin', () => {
  let fastify: FastifyInstance;

  afterEach(async () => {
    await fastify.close();
    vi.unstubAllEnvs();
  });

  describe('when environment is not production', () => {
    beforeEach(async () => {
      fastify = await buildSwaggerApp();
    });

    test('should expose /docs', async () => {
      const response = await fastify.inject({ method: 'GET', url: '/docs' });

      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });

  describe('when environment is production', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'production');
      fastify = await buildSwaggerApp();
    });

    test('should not expose /docs', async () => {
      const response = await fastify.inject({ method: 'GET', url: '/docs' });

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
