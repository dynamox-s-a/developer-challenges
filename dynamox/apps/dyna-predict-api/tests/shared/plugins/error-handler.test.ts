import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import Fastify, { type FastifyInstance } from 'fastify';
import * as Sentry from '@sentry/node';
import errorHandler from '../../../src/shared/plugins/error-handler';
import { INTERNAL_SERVER_ERROR, AUTH_ERR_TOKEN_EXPIRED } from '../../../src/shared/errors/errors';

vi.mock('@sentry/node', () => ({
  captureException: vi.fn(),
}));

async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: false });
  await fastify.register(errorHandler);
  return fastify;
}

describe('error handler plugin', () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = await buildApp();
  });

  afterEach(async () => {
    await fastify.close();
    vi.mocked(Sentry.captureException).mockClear();
  });

  describe('when a 4xx error is thrown', () => {
    test('should respond with the error shape and not report to Sentry', async () => {
      fastify.get('/test', async () => { throw new AUTH_ERR_TOKEN_EXPIRED(); });
      await fastify.ready();

      const response = await fastify.inject({ method: 'GET', url: '/test' });

      const { code, message, statusCode } = new AUTH_ERR_TOKEN_EXPIRED();
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual({ error: { code, message, statusCode } });
      expect(Sentry.captureException).not.toHaveBeenCalled();
    });
  });

  describe('when a 5xx error is thrown', () => {
    test('should respond with the error shape and report to Sentry', async () => {
      fastify.get('/test', async () => { throw new INTERNAL_SERVER_ERROR(); });
      await fastify.ready();

      const response = await fastify.inject({ method: 'GET', url: '/test' });

      const { code, message, statusCode } = new INTERNAL_SERVER_ERROR();
      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({ error: { code, message, statusCode } });
      expect(Sentry.captureException).toHaveBeenCalledOnce();
    });
  });

  describe('when an unexpected error is thrown', () => {
    test('should respond with 500 and report to Sentry', async () => {
      fastify.get('/test', async () => { throw new Error('something broke'); });
      await fastify.ready();

      const response = await fastify.inject({ method: 'GET', url: '/test' });

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json()).toEqual({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'something broke',
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      });
      expect(Sentry.captureException).toHaveBeenCalledOnce();
    });
  });

  describe('when a rate limit error is thrown', () => {
    describe('with a Retry-After header', () => {
      test('should respond with 429 and include retry time in the message', async () => {
        const retryAfter = '60';
        fastify.get('/test', async (request, reply) => {
          reply.header('Retry-After', retryAfter);
          throw Object.assign(new Error('rate limit'), { statusCode: StatusCodes.TOO_MANY_REQUESTS });
        });
        await fastify.ready();

        const response = await fastify.inject({ method: 'GET', url: '/test' });

        expect(response.statusCode).toBe(StatusCodes.TOO_MANY_REQUESTS);
        expect(response.json()).toEqual({
          error: {
            code: 'AUTH_ERR_TOO_MANY_REQUESTS',
            message: `Limite de requisições excedido. Tente novamente em ${retryAfter} segundos.`,
            statusCode: StatusCodes.TOO_MANY_REQUESTS,
          },
        });
      });
    });

    describe('without a Retry-After header', () => {
      test('should respond with 429 and a generic message', async () => {
        fastify.get('/test', async () => {
          throw Object.assign(new Error('rate limit'), { statusCode: StatusCodes.TOO_MANY_REQUESTS });
        });
        await fastify.ready();

        const response = await fastify.inject({ method: 'GET', url: '/test' });

        expect(response.statusCode).toBe(StatusCodes.TOO_MANY_REQUESTS);
        expect(response.json()).toEqual({
          error: {
            code: 'AUTH_ERR_TOO_MANY_REQUESTS',
            message: 'Limite de requisições excedido. Por favor, tente novamente mais tarde.',
            statusCode: StatusCodes.TOO_MANY_REQUESTS,
          },
        });
      });
    });
  });
});
