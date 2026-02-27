/**
 * @fileoverview Fastify type augmentations. Extends FastifyInstance with
 * decorated properties added via fastify.decorate() throughout the plugin
 * system.
 */

import { PrismaClient } from '../prisma/generated/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: number;
      uuid: string;
      email: string;
      role: string;
    };
    user: {
      sub: number;
      uuid: string;
      email: string;
      role: string;
    };
  }
}
