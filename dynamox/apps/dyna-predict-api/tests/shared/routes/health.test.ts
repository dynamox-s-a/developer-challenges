import { describe, expect } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { test } from '../../fixtures/fastify.fixture';

describe('GET/HEAD /health', () => {
  describe('when receiving a valid health check request', () => {
    (['GET', 'HEAD'] as const).forEach((method) => {
      test(`should return 200 for ${method}`, async ({ fastify }) => {
        const response = await fastify.inject({
          method,
          url: '/health',
        });

        expect(response.statusCode).toBe(StatusCodes.OK);
      });
    });
  });

  describe('when receiving an unsupported method', () => {
    (['POST', 'PUT', 'DELETE'] as const).forEach((method) => {
      test(`should return 404 for ${method}`, async ({ fastify }) => {
        const response = await fastify.inject({
          method,
          url: '/health',
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      });
    });
  });
});
