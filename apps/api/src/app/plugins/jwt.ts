import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export default fp(async function (fastify: FastifyInstance) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: '1h',
    },
  });
});