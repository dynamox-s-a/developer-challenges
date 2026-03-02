import { test as baseTest } from 'vitest';
import { faker } from '@faker-js/faker';
import type { BaseState } from '../../src/store/types';

export const baseInitialState: BaseState = {
  isLoading: false,
  error: null,
};

export const errorWithoutMessage = { name: 'UnknownError' } as Error;

export interface Fake {
  uuid: string;
  name: string;
  email: string;
  errorMessage: string;
}

interface UtilityFixtures {
  fake: Fake;
}

export const utilityTest = baseTest.extend<UtilityFixtures>({
  // eslint-disable-next-line no-empty-pattern
  fake: async ({}, use) => {
    await use({
      uuid: faker.string.uuid(),
      name: faker.word.noun(),
      email: faker.internet.email(),
      errorMessage: faker.lorem.sentence(),
    });
  },
});
