import { test as baseTest } from 'vitest';
import { faker } from '@faker-js/faker';

export interface Fake {
  id: number;
  uuid: string;
  userId: number;
  name: string;
  email: string;
  password: string;
  dbError: Error;
}

interface UtilityFixtures {
  fake: Fake;
}

export const utilityTest = baseTest.extend<UtilityFixtures>({
  // eslint-disable-next-line no-empty-pattern
  fake: async ({}, use) => {
    await use({
      id: faker.number.int({ min: 1 }),
      uuid: faker.string.uuid(),
      userId: faker.number.int({ min: 1 }),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      dbError: new Error('connection lost'),
    });
  },
});
