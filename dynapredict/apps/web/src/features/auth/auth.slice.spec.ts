import { configureStore } from '@reduxjs/toolkit';
import { AxiosError, type AxiosResponse } from 'axios';
import { api } from '../../lib/api-client';
import { tokenStorage } from '../../lib/token-storage';
import { authReducer, login } from './auth.slice';

const credentials = { email: 'admin@dynamox.com', password: 'dynapredict123' };
const user = { id: 'user-1', email: 'admin@dynamox.com' };

// Uma store só com o auth, criada do zero em cada teste
function createTestStore() {
  return configureStore({ reducer: { auth: authReducer } });
}

describe('authReducer', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('should start logged out when there is no saved token', () => {
    const state = authReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      token: null,
      user: null,
      status: 'idle',
      error: null,
    });
  });

  it('should start with the saved token (still logged in after F5)', () => {
    tokenStorage.set('token-salvo');

    const state = authReducer(undefined, { type: 'unknown' });

    expect(state.token).toBe('token-salvo');
  });

  it('should save the token and the user when the login succeeds', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { token: 'token-novo', user },
    });
    const store = createTestStore();

    await store.dispatch(login(credentials));

    expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(store.getState().auth).toMatchObject({
      token: 'token-novo',
      user,
      status: 'idle',
    });
    expect(tokenStorage.get()).toBe('token-novo');
  });

  it('should keep the api error message when the login fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 401,
      data: {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'E-mail ou senha inválidos',
        },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'post').mockRejectedValue(error);
    const store = createTestStore();

    await store.dispatch(login(credentials));

    expect(store.getState().auth).toMatchObject({
      token: null,
      status: 'failed',
      error: 'E-mail ou senha inválidos',
    });
    expect(tokenStorage.get()).toBeNull();
  });
});