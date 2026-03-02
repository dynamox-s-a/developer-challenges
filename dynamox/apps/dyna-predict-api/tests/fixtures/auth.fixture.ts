import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export interface MockUser {
  id: number;
  uuid: string;
  email: string;
  name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function createMockUser(overrides?: Partial<MockUser>): Promise<MockUser> {
  const plainPassword = overrides?.password || DEFAULT_TEST_PASSWORD;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    uuid: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    ...overrides,
    password: hashedPassword,
  };
}

export function createLoginPayload(overrides?: Partial<LoginPayload>): LoginPayload {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    ...overrides,
  };
}

export function mockJwtPayload() {
  return {
    sub: 1,
    uuid: faker.string.uuid(),
    email: faker.internet.email(),
  };
}

export const DEFAULT_TEST_PASSWORD = 'password123';
export const DEFAULT_TEST_EMAIL = 'test@example.com';

export const JWT_PATTERN = /^[\w-]+\.[\w-]+\.[\w-]+$/;
