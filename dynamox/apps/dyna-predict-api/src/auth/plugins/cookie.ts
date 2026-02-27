/**
 * @fileoverview Fastify plugin that registers @fastify/cookie for parsing and
 * setting cookies. Must be registered before @fastify/jwt since JWT auth reads
 * the token from the cookie.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(cookie, {
    hook: 'onRequest',
    parseOptions: {},
    secret: process.env.COOKIE_SECRET,
  } as FastifyCookieOptions);
});
