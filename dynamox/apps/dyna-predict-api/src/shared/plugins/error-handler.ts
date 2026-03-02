/**
 * @fileoverview Global error handler plugin. Intercepts all unhandled errors
 * and formats them into a consistent HTTP response shape. Error reporting to
 * Sentry is handled separately via the onError hook in the Sentry plugin.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import * as Sentry from '@sentry/node';

export default fp(async function errorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    // NOTE (@eric-reis): Capture only unexpected errors (no statusCode) or explicit 5xx.
    if (!error.statusCode || error.statusCode >= 500) Sentry.captureException(error);

    // NOTE (@eric-reis): Rate limit errors are handled separately because @fastify/rate-limit
    //                    populates the Retry-After header with useful context.
    if (error.statusCode === StatusCodes.TOO_MANY_REQUESTS) {
      const retryAfter = reply.getHeader('Retry-After');

      return reply.status(StatusCodes.TOO_MANY_REQUESTS).send({
        error: {
          code: 'AUTH_ERR_TOO_MANY_REQUESTS',
          message: retryAfter
            ? `Limite de requisições excedido. Tente novamente em ${retryAfter} segundos.`
            : 'Limite de requisições excedido. Por favor, tente novamente mais tarde.',
          statusCode: StatusCodes.TOO_MANY_REQUESTS,
        },
      });
    }

    const statusCode = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

    return reply.status(statusCode).send({
      error: {
        code: error.code ?? 'INTERNAL_SERVER_ERROR',
        message: error.message,
        statusCode,
      },
    });
  });
});
