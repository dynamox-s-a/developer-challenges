import { describe, expect, test } from 'vitest';
import Fastify from 'fastify';
import sensiblePlugin from '../../../src/shared/plugins/sensible';

describe('sensible plugin', () => {
  test('should register without errors', async () => {
    const fastify = Fastify({ logger: false });
    await fastify.register(sensiblePlugin);
    await expect(fastify.ready()).resolves.not.toThrow();
    await fastify.close();
  });
});
