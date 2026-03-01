/**
 * @fileoverview Sentry plugin. Initializes the Sentry SDK for error monitoring
 * in production. In other environments this plugin is a no-op, so the app
 * behaves identically without a DSN configured.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import * as Sentry from '@sentry/node';

export default fp(async function sentryPlugin(fastify: FastifyInstance) {
  if (process.env.NODE_ENV !== 'production') return;

  if (!process.env.SENTRY_DSN) {
    fastify.log.warn('SENTRY_DSN not set — Sentry will not be initialized');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enableLogs: true,
    integrations: [
      Sentry.onUncaughtExceptionIntegration(),
      Sentry.onUnhandledRejectionIntegration(),
    ],
    release: process.env.npm_package_version,
    sendDefaultPii: false,
  });

  fastify.log.info('Sentry initialized');
});
