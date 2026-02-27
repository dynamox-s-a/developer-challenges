/**
 * @fileoverview Fastify plugin that registers @fastify/sensible, which adds
 * useful HTTP error utilities like reply.notFound() and reply.badRequest()
 * to all route handlers.
 *
 * @see https://github.com/fastify/fastify-sensible
 */

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(sensible);
});
