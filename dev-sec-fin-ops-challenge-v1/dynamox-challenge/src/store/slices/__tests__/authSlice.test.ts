import authReducer, { login, logout, clearError } from '@/store/slices/authSlice';
import { AuthState } from '@/types';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle logout', () => {
    const previousState: AuthState = {
      user: { id: 1, email: 'test@test.com', role: 'admin', name: 'Test User' },
      token: 'test-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    expect(authReducer(previousState, logout())).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const previousState: AuthState = {
      ...initialState,
      error: 'Some error',
    };

    expect(authReducer(previousState, clearError())).toEqual(initialState);
  });

  it('should handle login.pending', () => {
    const actual = authReducer(initialState, { type: login.pending.type });
    expect(actual.loading).toBe(true);
    expect(actual.error).toBe(null);
  });

  it('should handle login.fulfilled', () => {
    const payload = {
      token: 'test-token',
      user: { id: 1, email: 'test@test.com', role: 'admin' as const, name: 'Test User' },
    };

    const actual = authReducer(initialState, {
      type: login.fulfilled.type,
      payload,
    });

    expect(actual.loading).toBe(false);
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.user).toEqual(payload.user);
    expect(actual.token).toBe(payload.token);
    expect(actual.error).toBe(null);
  });

  it('should handle login.rejected', () => {
    const actual = authReducer(initialState, {
      type: login.rejected.type,
      payload: 'Login failed',
    });

    expect(actual.loading).toBe(false);
    expect(actual.error).toBe('Login failed');
  });
});
