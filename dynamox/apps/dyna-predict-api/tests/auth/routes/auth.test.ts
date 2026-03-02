import { describe, expect, vi } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import * as authService from '../../../src/auth/domain/auth.service';
import * as userRepository from '../../../src/auth/data-access/user.repository';
import { test, authenticatedTest } from '../../fixtures/fastify.fixture';
import { createLoginPayload, createMockUser, JWT_PATTERN } from '../../fixtures/auth.fixture';
import { createErrorResponse, createPartialErrorResponse } from '../../shared/errors';
import {
  AUTH_ERR_INVALID_CREDENTIALS,
  AUTH_ERR_TOO_MANY_REQUESTS,
  USER_ERR_NOT_FOUND,
} from '../../../src/shared/errors/errors';
import { LOGIN_RATE_LIMIT, TOKEN_COOKIE_OPTIONS } from '../../../src/auth/domain/auth.constants';

describe('POST /v1/auth/login', () => {
  describe('when credentials are invalid', () => {
    test('should return 401 unauthorized', async ({ fastify }) => {
      const validateUserCredentialsSpy = vi
        .spyOn(authService, 'validateUserCredentials')
        .mockRejectedValue(new AUTH_ERR_INVALID_CREDENTIALS());

      const response = await fastify.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: createLoginPayload(),
      });

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.json()).toEqual(createErrorResponse(AUTH_ERR_INVALID_CREDENTIALS));

      expect(validateUserCredentialsSpy).toHaveBeenCalledOnce();
    });
  });

  describe('when rate limit is exceeded', () => {
    test('should return 429 after max attempts', async ({ fastify }) => {
      const validateUserCredentialsSpy = vi
        .spyOn(authService, 'validateUserCredentials')
        .mockRejectedValue(new AUTH_ERR_INVALID_CREDENTIALS());

      const responses = [];
      for (let i = 0; i < LOGIN_RATE_LIMIT.MAX + 1; i++) {
        const response = await fastify.inject({
          method: 'POST',
          url: '/v1/auth/login',
          payload: createLoginPayload(),
        });
        responses.push(response);
      }

      for (let i = 0; i < LOGIN_RATE_LIMIT.MAX; i++) {
        expect(responses[i].statusCode).toBe(StatusCodes.UNAUTHORIZED);
      }

      const blockedResponse = responses[LOGIN_RATE_LIMIT.MAX];

      expect(blockedResponse.statusCode).toBe(StatusCodes.TOO_MANY_REQUESTS);
      expect(blockedResponse.json()).toEqual(
        createPartialErrorResponse(AUTH_ERR_TOO_MANY_REQUESTS),
      );
      expect(blockedResponse.headers['x-ratelimit-remaining']).toBe('0');

      expect(validateUserCredentialsSpy).toHaveBeenCalledTimes(LOGIN_RATE_LIMIT.MAX);
    });
  });

  describe('when credentials are valid', () => {
    test('should return 200 with user data and set JWT cookie', async ({ fastify }) => {
      const mockUser = await createMockUser();
      const validateUserCredentialsSpy = vi.spyOn(authService, 'validateUserCredentials').mockResolvedValue(mockUser);

      const response = await fastify.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: createLoginPayload({ email: mockUser.email }),
      });

      expect(response.statusCode).toBe(StatusCodes.OK);

      const { user } = response.json();
      expect(user).toMatchObject({
        id: mockUser.id,
        uuid: mockUser.uuid,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(user.password).toBeUndefined();

      const cookieHeader = response.headers['set-cookie'] as string;
      const tokenValue = cookieHeader.match(/^token=([^;]+)/)?.[1];
      expect(tokenValue).toMatch(JWT_PATTERN);
      expect(cookieHeader).toContain('HttpOnly');
      expect(cookieHeader).toContain('SameSite=Strict');
      expect(cookieHeader).toContain(`Path=${TOKEN_COOKIE_OPTIONS.path}`);
      expect(cookieHeader).toContain(`Max-Age=${TOKEN_COOKIE_OPTIONS.maxAge}`);

      expect(validateUserCredentialsSpy).toHaveBeenCalledOnce();
    });
  });
});

describe('POST /v1/auth/logout', () => {
  test('should return 204 and clear the token cookie', async ({ fastify }) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/v1/auth/logout',
    });

    expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

    const cookieHeader = response.headers['set-cookie'] as string;
    expect(cookieHeader).toContain('token=;');
    expect(cookieHeader).toContain('Path=/');
  });
});

describe('GET /v1/auth/me', () => {
  describe('when user is not found', () => {
    authenticatedTest('should return 404', async ({ fastify }) => {
      const findUserByIdSpy = vi.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      const response = await fastify.inject({
        method: 'GET',
        url: '/v1/auth/me',
      });

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.json()).toEqual(createErrorResponse(USER_ERR_NOT_FOUND));

      expect(findUserByIdSpy).toHaveBeenCalledOnce();
    });
  });

  describe('when authenticated', () => {
    authenticatedTest(
      'should return 200 with user data',
      async ({ fastify, authenticatedUser }) => {
        const mockUserData = {
          id: authenticatedUser.sub,
          uuid: authenticatedUser.uuid,
          email: authenticatedUser.email,
          name: 'Test User',
        };

        const findUserByIdSpy = vi.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUserData);

        const response = await fastify.inject({
          method: 'GET',
          url: '/v1/auth/me',
        });

        expect(response.statusCode).toBe(StatusCodes.OK);

        const { user } = response.json();
        expect(user).toMatchObject({
          id: authenticatedUser.sub,
          uuid: authenticatedUser.uuid,
          email: authenticatedUser.email,
        });
        expect(user.password).toBeUndefined();

        expect(findUserByIdSpy).toHaveBeenCalledOnce();
      },
    );
  });
});
