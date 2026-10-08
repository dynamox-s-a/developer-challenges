import { setupStore } from '../../app/store';
import * as authApi from '../../services/authApi';
import { httpError } from '../../testing/renderWithProviders';
import {
  type AuthState,
  authReducer,
  fetchMe,
  login,
  logout,
  SESSION_EXPIRED_ERROR,
  sessionExpired,
} from './authSlice';

vi.mock('../../services/authApi');

const user = { email: 'admin@dynapredict.com' };
const credentials = { email: user.email, password: 'secret' };

const authenticated: AuthState = {
  status: 'authenticated',
  user,
  loginPending: false,
  error: null,
};

function storeWith(auth?: AuthState) {
  return setupStore(auth && { auth });
}

describe('authSlice', () => {
  beforeEach(() => vi.resetAllMocks());

  it('starts unknown until the boot check answers', () => {
    expect(authReducer(undefined, { type: 'init' })).toEqual({
      status: 'unknown',
      user: null,
      loginPending: false,
      error: null,
    });
  });

  describe('login', () => {
    it('marks the login as pending and clears the previous error', () => {
      const state = authReducer(
        {
          status: 'unauthenticated',
          user: null,
          loginPending: false,
          error: SESSION_EXPIRED_ERROR,
        },
        login.pending('req', credentials),
      );
      expect(state.loginPending).toBe(true);
      expect(state.error).toBeNull();
    });

    it('stores the user on success', async () => {
      vi.mocked(authApi.login).mockResolvedValue(user);
      const store = storeWith();
      await store.dispatch(login(credentials));
      expect(authApi.login).toHaveBeenCalledWith(credentials);
      expect(store.getState().auth).toEqual(authenticated);
    });

    it('keeps the API message when the credentials are wrong', async () => {
      vi.mocked(authApi.login).mockRejectedValue(
        httpError(401, {
          error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' },
        }),
      );
      const store = storeWith();
      await store.dispatch(login(credentials));
      expect(store.getState().auth).toMatchObject({
        status: 'unauthenticated',
        user: null,
        loginPending: false,
        error: { status: 401, message: 'Invalid email or password' },
      });
    });
  });

  describe('fetchMe', () => {
    it('restores the session from the cookie', async () => {
      vi.mocked(authApi.me).mockResolvedValue(user);
      const store = storeWith();
      await store.dispatch(fetchMe());
      expect(store.getState().auth).toEqual(authenticated);
    });

    it('treats a missing session as logged out, without an error', async () => {
      vi.mocked(authApi.me).mockRejectedValue(
        httpError(401, {
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        }),
      );
      const store = storeWith();
      await store.dispatch(fetchMe());
      expect(store.getState().auth).toMatchObject({
        status: 'unauthenticated',
        error: null,
      });
    });

    it('does not undo a login that finished first', () => {
      const state = authReducer(
        authenticated,
        fetchMe.rejected(null, 'req', undefined),
      );
      expect(state).toEqual(authenticated);
    });
  });

  describe('logout', () => {
    it('clears the session', async () => {
      vi.mocked(authApi.logout).mockResolvedValue();
      const store = storeWith(authenticated);
      await store.dispatch(logout());
      expect(authApi.logout).toHaveBeenCalled();
      expect(store.getState().auth).toMatchObject({
        status: 'unauthenticated',
        user: null,
      });
    });

    it('clears the session locally even if the request fails', async () => {
      vi.mocked(authApi.logout).mockRejectedValue(new Error('offline'));
      const store = storeWith(authenticated);
      await store.dispatch(logout());
      expect(store.getState().auth.status).toBe('unauthenticated');
    });
  });

  describe('sessionExpired', () => {
    it('signs out and explains why', () => {
      expect(authReducer(authenticated, sessionExpired())).toEqual({
        status: 'unauthenticated',
        user: null,
        loginPending: false,
        error: SESSION_EXPIRED_ERROR,
      });
    });

    it('is ignored when nobody is signed in', () => {
      const loggedOut: AuthState = {
        status: 'unauthenticated',
        user: null,
        loginPending: false,
        error: null,
      };
      expect(authReducer(loggedOut, sessionExpired())).toEqual(loggedOut);
    });
  });
});
