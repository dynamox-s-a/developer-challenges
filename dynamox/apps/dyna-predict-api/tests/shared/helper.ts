import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { vi } from 'vitest';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import errorHandler from '../../src/shared/plugins/error-handler';
import jwtPlugin from '../../src/auth/plugins/jwt';
import authRoutes from '../../src/auth/routes/auth';
import { faker } from '@faker-js/faker';
import health from '../../src/shared/routes/health';

type AuthenticatedUser = { sub: number; uuid: string; email: string; role: string };

async function createApp(): Promise<FastifyInstance> {
  const fastify = Fastify({ logger: false });

  // NOTE (@eric-reis): cookie plugin must be registered before jwtPlugin (declared dependency)
  await fastify.register(cookie, { hook: 'onRequest', parseOptions: {} });
  await fastify.register(sensible);
  await fastify.register(rateLimit, { global: false, max: 10000, timeWindow: '1 minute' });
  await fastify.register(errorHandler);

  vi.stubEnv('JWT_SECRET', faker.string.alphanumeric(32));
  await fastify.register(jwtPlugin);

  return fastify;
}

export async function build(): Promise<FastifyInstance> {
  const fastify = await createApp();

  await fastify.register(authRoutes, { prefix: '/v1' });
  await fastify.register(health)

  await fastify.ready();
  vi.clearAllMocks();

  return fastify;
}

export async function buildAuthenticated(user: AuthenticatedUser): Promise<FastifyInstance> {
  const fastify = await createApp();

  await fastify.register(
    fp(async (instance) => {
      instance.authenticate = vi.fn().mockImplementation(async (request: FastifyRequest) => {
        request.user = user;
      });
    }),
  );

  await fastify.register(authRoutes, { prefix: '/v1' });
  await fastify.ready();
  vi.clearAllMocks();

  return fastify;
}
