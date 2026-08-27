import { describe, expect, it, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login } from './authSlice';
import { authApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}));

describe('auth login thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('stores token and user on successful login', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      accessToken: 'token-123',
      user: { id: 'u1', email: 'admin@dynamox.test', name: 'Admin' },
    });

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(login({ email: 'admin@dynamox.test', password: 'Dynamox@123' }));

    const state = store.getState().auth;
    expect(state.accessToken).toBe('token-123');
    expect(state.user?.email).toBe('admin@dynamox.test');
    expect(localStorage.getItem('accessToken')).toBe('token-123');
  });

  it('sets error on failed login', async () => {
    const { ApiClientError } = await import('../../services/apiClient');
    vi.mocked(authApi.login).mockRejectedValue(new ApiClientError(401, 'Invalid email or password'));

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(login({ email: 'bad@test.com', password: 'wrong' }));

    const state = store.getState().auth;
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid email or password');
    expect(state.accessToken).toBeNull();
  });
});
