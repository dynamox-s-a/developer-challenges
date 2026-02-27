/**
 * @fileoverview CORS plugin. Configures allowed origins, methods and credential
 * headers so the browser-based frontend can communicate with the API. The origin
 * is read from CORS_ORIGIN to keep it configurable per environment.
 */

import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import { ACCEPTED_CORS_METHODS } from '../../auth/domain/auth.constants';

export default fp(async function corsPlugin(fastify: FastifyInstance) {
  fastify.register(cors, {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: [...ACCEPTED_CORS_METHODS],
  });
});
