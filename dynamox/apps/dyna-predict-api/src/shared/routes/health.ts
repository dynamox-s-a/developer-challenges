/**
 * @fileoverview Root routes. Exposes the health check endpoint used by
 * uptime monitors to verify server availability and prevent cold starts.
 */

import type { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: ['GET', 'HEAD'],
    url: '/health',
    schema: {
      tags: ['health'],
    },
    handler: async () => {
      return { status: 'ok' };
    },
  });
}
