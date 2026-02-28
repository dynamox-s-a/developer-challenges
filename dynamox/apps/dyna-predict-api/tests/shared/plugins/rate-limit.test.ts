import { describe, expect, test } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import Fastify from 'fastify';
import rateLimitPlugin from '../../../src/shared/plugins/rate-limit';

describe('rate limit plugin', () => {
  test('should register without errors', async () => {
    const fastify = Fastify({ logger: false });
    await fastify.register(rateLimitPlugin);
    await expect(fastify.ready()).resolves.not.toThrow();
    await fastify.close();
  });

  describe('when the rate limit is exceeded', () => {
    test('should return 429', async () => {
      const fastify = Fastify({ logger: false });
      await fastify.register(rateLimitPlugin);

      fastify.route({
        method: 'GET',
        url: '/test',
        config: { rateLimit: { max: 1, timeWindow: '1 minute' } },
        handler: async () => ({ ok: true }),
      });

      await fastify.ready();

      await fastify.inject({ method: 'GET', url: '/test' });
      const response = await fastify.inject({ method: 'GET', url: '/test' });

      expect(response.statusCode).toBe(StatusCodes.TOO_MANY_REQUESTS);

      await fastify.close();
    });
  });
});
