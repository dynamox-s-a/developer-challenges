import { vi } from 'vitest';
import { type FastifyInstance } from 'fastify';
import { build, buildAuthenticated } from '../shared/helper';
import { createMockUser } from './auth.fixture';
import { utilityTest } from './utility.fixture';

interface FastifyFixtures {
  fastify: FastifyInstance;
}

export const test = utilityTest.extend<FastifyFixtures>({
  // eslint-disable-next-line no-empty-pattern
  fastify: async ({}, use) => {
    const app = await build();

    await use(app);

    await app.close();
  },
});

type AuthenticatedUser = { sub: number; uuid: string; email: string };

interface AuthenticatedFixtures {
  authenticatedUser: AuthenticatedUser;
  fastify: FastifyInstance;
}

export const authenticatedTest = utilityTest.extend<AuthenticatedFixtures>({
  // eslint-disable-next-line no-empty-pattern
  authenticatedUser: async ({}, use) => {
    const user = await createMockUser();
    await use({ sub: user.id, uuid: user.uuid, email: user.email });
  },
  fastify: async ({ authenticatedUser }, use) => {
    const app = await buildAuthenticated(authenticatedUser);

    await use(app);

    await app.close();
  },
});

export const repositoryTest = utilityTest.extend<FastifyFixtures>({
  // eslint-disable-next-line no-empty-pattern
  fastify: async ({}, use) => {
    await use({
      prisma: {},
      log: { error: vi.fn() },
    } as unknown as FastifyInstance);
  },
});
