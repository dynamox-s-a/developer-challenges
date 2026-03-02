import { faker } from '@faker-js/faker';
import { utilityTest, baseInitialState } from './utility.fixture';
import type { User } from '@dynamox/types';
import type { AuthState } from '../../src/store/features/auth/auth.slice';

export const initialAuthState: AuthState = {
  ...baseInitialState,
  currentUser: null,
  isAuthenticated: false,
};

interface Credentials {
  email: string;
  password: string;
}

interface AuthFixtures {
  mockUser: User;
  mockCredentials: Credentials;
}

export const authTest = utilityTest.extend<AuthFixtures>({
  mockUser: async ({ fake }, use) => {
    await use({
      id: faker.number.int({ min: 1 }),
      uuid: fake.uuid,
      name: fake.name,
      email: fake.email,
    });
  },

  mockCredentials: async ({ fake }, use) => {
    await use({
      email: fake.email,
      password: faker.internet.password(),
    });
  },
});
