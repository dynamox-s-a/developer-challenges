/**
 * @fileoverview Authentication routes. Handles login, session management and
 * current-user resolution via httpOnly JWT cookies. All routes are registered
 * under the /v1/auth prefix.
 */

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { LoginRequestSchema, LoginResponseSchema, UserDataResponseSchema } from '@dynamox/types';
import { StatusCodes } from 'http-status-codes';
import { JWT_EXPIRATION, LOGIN_RATE_LIMIT, TOKEN_COOKIE_OPTIONS } from '../domain/auth.constants';
import { validateUserCredentials } from '../domain/auth.service';
import { findUserById } from '../data-access/user.repository';
import { USER_ERR_NOT_FOUND } from '../../shared/errors/errors';

const plugin: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.register(authRoutes, { prefix: '/auth' });
};

const authRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.post(
    '/login',
    {
      config: {
        rateLimit: {
          max: LOGIN_RATE_LIMIT.MAX,
          timeWindow: LOGIN_RATE_LIMIT.TIME_WINDOW,
        },
      },
      schema: {
        tags: ['auth'],
        description: 'Autentica o usuário e define um cookie JWT httpOnly assinado.',
        security: [],
        body: LoginRequestSchema,
        response: {
          200: LoginResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const email = request.body.email.trim().toLowerCase();
      const { password } = request.body;

      const user = await validateUserCredentials(fastify, email, password);

      const token = await reply.jwtSign(
        {
          sub: user.id,
          uuid: user.uuid,
          email: user.email,
        },
        { expiresIn: JWT_EXPIRATION },
      );

      reply.setCookie('token', token, TOKEN_COOKIE_OPTIONS);

      return reply.send({
        user: {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          name: user.name,
        },
      });
    },
  );

  fastify.post(
    '/logout',
    {
      schema: {
        tags: ['auth'],
        description: 'Encerra a sessão do usuário.',
        security: [],
      },
    },
    async (_, reply) => {
      reply.clearCookie('token', { path: '/' });

      return reply.code(StatusCodes.NO_CONTENT).send();
    },
  );

  fastify.get(
    '/me',
    {
      preValidation: [fastify.authenticate],
      schema: {
        tags: ['auth'],
        description: 'Retorna os dados do usuário autenticado.',
        response: {
          200: UserDataResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;

      const user = await findUserById(fastify, userId);

      if (!user) throw new USER_ERR_NOT_FOUND();

      return reply.send({
        user: {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          name: user.name,
        },
      });
    },
  );
};

export default plugin;
