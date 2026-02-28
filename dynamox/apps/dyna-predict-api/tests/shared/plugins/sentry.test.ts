import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import * as Sentry from '@sentry/node';
import { faker } from '@faker-js/faker';
import sentryPlugin from '../../../src/shared/plugins/sentry';

vi.mock('@sentry/node', () => ({
  init: vi.fn(),
  onUncaughtExceptionIntegration: vi.fn(),
  onUnhandledRejectionIntegration: vi.fn(),
}));

describe('sentry plugin', () => {
  let fastify: FastifyInstance;
  let sentryDsn: string;

  beforeEach(() => {
    sentryDsn = faker.internet.url({ appendSlash: false });
    fastify = Fastify({ logger: false });
  });

  afterEach(async () => {
    await fastify.close();
    vi.mocked(Sentry.init).mockClear();
    vi.unstubAllEnvs();
  });

  describe('when environment is not production', () => {
    test('should not initialize Sentry', async () => {
      vi.stubEnv('NODE_ENV', 'development');

      await fastify.register(sentryPlugin);

      expect(Sentry.init).not.toHaveBeenCalled();
    });
  });

  describe('when environment is production', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    describe('when SENTRY_DSN is not set', () => {
      test('should not initialize Sentry', async () => {
        await fastify.register(sentryPlugin);

        expect(Sentry.init).not.toHaveBeenCalled();
      });
    });

    describe('when SENTRY_DSN is set', () => {
      beforeEach(() => {
        vi.stubEnv('SENTRY_DSN', sentryDsn);
      });

      test('should initialize Sentry with the correct DSN', async () => {
        await fastify.register(sentryPlugin);

        expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({ dsn: sentryDsn }));
      });
    });
  });
});
