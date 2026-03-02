import { describe, expect } from 'vitest';
import authReducer, {
  login,
  logout,
  fetchMe,
} from '../../../../src/store/features/auth/auth.slice';
import { authTest, initialAuthState } from '../../../fixtures/auth.fixture';
import { errorWithoutMessage } from '../../../fixtures/utility.fixture';

describe('authSlice', () => {
  describe('login', () => {
    describe('when pending', () => {
      authTest('should set isLoading to true and clear the error', async ({ mockCredentials }) => {
        const action = login.pending('requestId', mockCredentials);

        const nextState = authReducer(initialAuthState, action);

        expect(nextState.isLoading).toBe(true);
        expect(nextState.error).toBeNull();
      });
    });

    describe('when fulfilled', () => {
      authTest(
        'should authenticate the user and set the currentUser',
        async ({ mockUser, mockCredentials }) => {
          const action = login.fulfilled({ user: mockUser }, 'requestId', mockCredentials);

          const nextState = authReducer(initialAuthState, action);

          expect(nextState.isAuthenticated).toBe(true);
          expect(nextState.currentUser).toEqual(mockUser);
          expect(nextState.isLoading).toBe(false);
        },
      );
    });

    describe('when rejected with a known error', () => {
      authTest(
        'should store the error message from rejectWithValue',
        async ({ fake, mockCredentials }) => {
          const action = login.rejected(null, 'requestId', mockCredentials, fake.errorMessage);

          const nextState = authReducer(initialAuthState, action);

          expect(nextState.isLoading).toBe(false);
          expect(nextState.error).toBe(fake.errorMessage);
        },
      );
    });

    describe('when rejected without a payload', () => {
      authTest('should fall back to the default error message', async ({ mockCredentials }) => {
        const action = login.rejected(errorWithoutMessage, 'requestId', mockCredentials);

        const nextState = authReducer(initialAuthState, action);

        expect(nextState.isLoading).toBe(false);
        expect(nextState.error).toBe('Erro ao fazer login');
      });
    });
  });

  describe('logout', () => {
    describe('when fulfilled', () => {
      authTest('should reset state back to initial', async ({ mockUser }) => {
        const authenticatedState = {
          ...initialAuthState,
          isAuthenticated: true,
          currentUser: mockUser,
        };
        const action = logout.fulfilled(null, 'requestId');

        const nextState = authReducer(authenticatedState, action);

        expect(nextState).toEqual(initialAuthState);
      });
    });
  });

  describe('fetchMe', () => {
    describe('when fulfilled', () => {
      authTest('should authenticate the user without setting isLoading', async ({ mockUser }) => {
        const action = fetchMe.fulfilled({ user: mockUser }, 'requestId');

        const nextState = authReducer(initialAuthState, action);

        expect(nextState.isAuthenticated).toBe(true);
        expect(nextState.currentUser).toEqual(mockUser);
      });
    });

    describe('when rejected with a known error', () => {
      authTest('should clear auth state and store the error', async ({ fake }) => {
        const action = fetchMe.rejected(fake.error, 'requestId');

        const nextState = authReducer(initialAuthState, action);

        expect(nextState.isAuthenticated).toBe(false);
        expect(nextState.currentUser).toBeNull();
        expect(nextState.error).toBe(fake.errorMessage);
      });
    });

    describe('when rejected without an error message', () => {
      authTest('should fall back to the default error message', async () => {
        const action = fetchMe.rejected(errorWithoutMessage, 'requestId');

        const nextState = authReducer(initialAuthState, action);

        expect(nextState.isAuthenticated).toBe(false);
        expect(nextState.currentUser).toBeNull();
        expect(nextState.error).toBe('Erro ao carregar as informações do usuário');
      });
    });
  });
});
