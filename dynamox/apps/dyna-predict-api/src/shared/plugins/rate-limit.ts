/**
 * @fileoverview Fastify plugin that registers global rate limiting to protect
 * all routes from abuse. Limits each IP to 100 requests per minute by default.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  });
});
