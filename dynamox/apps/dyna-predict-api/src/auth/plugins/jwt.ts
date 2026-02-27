/**
 * @fileoverview Fastify plugin that registers @fastify/jwt and decorates the
 * instance with the `authenticate` hook used as preValidation in protected
 * routes. Depends on @fastify/cookie being registered first since JWT reads
 * the token from the httpOnly cookie.
 */

import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { AUTH_ERR_TOKEN_EXPIRED } from '../../shared/errors/errors';

export default fp(
  async function (fastify: FastifyInstance) {
    fastify.register(jwt, {
      secret: process.env.JWT_SECRET ?? '',
      cookie: {
        cookieName: 'token',
        signed: process.env.NODE_ENV === 'production',
      },
    });

    fastify.decorate('authenticate', async function (request: FastifyRequest) {
      try {
        await request.jwtVerify();
      } catch {
        throw new AUTH_ERR_TOKEN_EXPIRED();
      }
    });
  },
  {
    dependencies: ['@fastify/cookie'],
    name: 'jwt',
  },
);
