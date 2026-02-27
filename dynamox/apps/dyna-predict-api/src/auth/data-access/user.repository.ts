/**
 * @fileoverview Database queries for the User entity. All queries are scoped
 * to the auth domain and receive the Fastify instance to access the Prisma
 * client via the decorated fastify.prisma property.
 */

import type { FastifyInstance } from 'fastify';
import { INTERNAL_SERVER_ERROR, withCause } from '../../shared/errors/errors';

export async function findUserByEmail(fastify: FastifyInstance, email: string) {
  try {
    return await fastify.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        uuid: true,
        email: true,
        name: true,
        password: true,
        role: true,
      },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function findUserById(fastify: FastifyInstance, id: number) {
  try {
    return await fastify.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        uuid: true,
        email: true,
        name: true,
        role: true,
      },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}
