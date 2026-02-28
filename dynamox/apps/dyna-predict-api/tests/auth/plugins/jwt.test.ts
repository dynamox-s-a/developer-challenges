import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import Fastify, { type FastifyInstance } from 'fastify';
import { faker } from '@faker-js/faker';
import { createSigner } from 'fast-jwt';
import cookiePlugin from '../../../src/auth/plugins/cookie';
import jwtPlugin from '../../../src/auth/plugins/jwt';
import errorHandler from '../../../src/shared/plugins/error-handler';
import { AUTH_ERR_TOKEN_EXPIRED } from '../../../src/shared/errors/errors';
import { createErrorResponse } from '../../shared/errors';
import { mockJwtPayload } from '../../fixtures/auth.fixture';

async function buildJwtApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: false });

  await fastify.register(cookiePlugin);
  await fastify.register(errorHandler);
  await fastify.register(jwtPlugin);

  fastify.get('/protected', {
    preValidation: async (request, reply) => fastify.authenticate(request, reply),
  }, async () => ({ ok: true }));

  await fastify.ready();
  return fastify;
}

describe('jwt plugin', () => {
  describe('authenticate decorator', () => {
    let fastify: FastifyInstance;

    beforeEach(async () => {
      vi.stubEnv('JWT_SECRET', faker.string.alphanumeric(32));
      fastify = await buildJwtApp();
    });

    afterEach(async () => {
      await fastify.close();
      vi.unstubAllEnvs();
    });

    describe('when no token is provided', () => {
      test('should return 401 with AUTH_ERR_TOKEN_EXPIRED', async () => {
        const response = await fastify.inject({
          method: 'GET',
          url: '/protected',
        });

        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.json()).toEqual(createErrorResponse(AUTH_ERR_TOKEN_EXPIRED));
      });
    });

    describe('when token is invalid', () => {
      test('should return 401 with AUTH_ERR_TOKEN_EXPIRED', async () => {
        const response = await fastify.inject({
          method: 'GET',
          url: '/protected',
          cookies: { token: 'invalid.token.value' },
        });

        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.json()).toEqual(createErrorResponse(AUTH_ERR_TOKEN_EXPIRED));
      });
    });

    describe('when token is valid', () => {
      test('should pass through with request.user populated', async () => {
        const token = fastify.jwt.sign(mockJwtPayload());

        const response = await fastify.inject({
          method: 'GET',
          url: '/protected',
          cookies: { token },
        });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual({ ok: true });
      });
    });
  });

  describe('plugin configuration', () => {
    afterEach(() => vi.unstubAllEnvs());

    describe('when JWT_SECRET is set', () => {
      test('should reject tokens signed with a different secret', async () => {
        vi.stubEnv('JWT_SECRET', faker.string.alphanumeric(32));
        const app = await buildJwtApp();

        const signWithDifferentSecret = createSigner({ key: faker.string.alphanumeric(32) });
        const foreignToken = signWithDifferentSecret(mockJwtPayload());

        const response = await app.inject({
          method: 'GET',
          url: '/protected',
          cookies: { token: foreignToken },
        });

        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.json()).toEqual(createErrorResponse(AUTH_ERR_TOKEN_EXPIRED));

        await app.close();
      });
    });

    describe('when environment is production', () => {
      let fastify: FastifyInstance;

      beforeEach(async () => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('COOKIE_SECRET', faker.string.alphanumeric(32));
        vi.stubEnv('JWT_SECRET', faker.string.alphanumeric(32));
        fastify = await buildJwtApp();
      });

      afterEach(async () => await fastify.close());

      test('should reject unsigned cookies', async () => {
        const token = fastify.jwt.sign(mockJwtPayload());

        const response = await fastify.inject({
          method: 'GET',
          url: '/protected',
          cookies: { token },
        });

        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        expect(response.json()).toEqual(createErrorResponse(AUTH_ERR_TOKEN_EXPIRED));
      });

      test('should accept signed cookies', async () => {
        const token = fastify.jwt.sign(mockJwtPayload());
        const signedToken = fastify.signCookie(token);

        const response = await fastify.inject({
          method: 'GET',
          url: '/protected',
          cookies: { token: signedToken },
        });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual({ ok: true });
      });
    });
  });
});
