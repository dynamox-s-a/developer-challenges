import { afterEach, describe, expect, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { test } from '../../fixtures/fastify.fixture';
import * as userRepository from '../../../src/auth/data-access/user.repository';
import { validateUserCredentials } from '../../../src/auth/domain/auth.service';
import { createMockUser, createLoginPayload } from '../../fixtures/auth.fixture';
import { AUTH_ERR_INVALID_CREDENTIALS } from '../../../src/shared/errors/errors';

describe('validateUserCredentials', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when user does not exist', () => {
    test('should throw AUTH_ERR_INVALID_CREDENTIALS', async ({ fastify }) => {
      const payload = createLoginPayload();

      const spy = vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);

      await expect(
        validateUserCredentials(fastify, payload.email, payload.password),
      ).rejects.toThrow(AUTH_ERR_INVALID_CREDENTIALS);

      expect(spy).toHaveBeenCalledWith(expect.anything(), payload.email);
    });
  });

  describe('when password is incorrect', () => {
    test('should throw AUTH_ERR_INVALID_CREDENTIALS', async ({ fastify }) => {
      const mockUser = await createMockUser({ password: faker.internet.password() });

      const spy = vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser);

      await expect(
        validateUserCredentials(fastify, mockUser.email, faker.internet.password()),
      ).rejects.toThrow(AUTH_ERR_INVALID_CREDENTIALS);

      expect(spy).toHaveBeenCalledWith(expect.anything(), mockUser.email);
    });
  });

  describe('when credentials are valid', () => {
    test('should return the user found', async ({ fastify }) => {
      const plainPassword = faker.internet.password();
      const mockUser = await createMockUser({ password: plainPassword });

      const spy = vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser);

      const result = await validateUserCredentials(fastify, mockUser.email, plainPassword);

      expect(result).toMatchObject({ id: mockUser.id, email: mockUser.email });

      expect(spy).toHaveBeenCalledWith(expect.anything(), mockUser.email);
    });
  });
});
