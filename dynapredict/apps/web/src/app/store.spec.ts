import { AxiosError, type AxiosAdapter } from 'axios';
import { api } from '../lib/api-client';
import { tokenStorage } from '../lib/token-storage';
import { setupStore } from './store';

// "Servidor de mentira" que sempre responde 401 (token vencido ou inválido)
const answer401: AxiosAdapter = async (config) => {
  throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
    data: { error: { code: 'UNAUTHORIZED', message: 'Token inválido' } },
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config,
  });
};

describe('store', () => {
  beforeEach(() => localStorage.clear());

  it('should log out with a message when any api call answers 401', async () => {
    tokenStorage.set('token-vencido');
    const store = setupStore();

    await expect(
      api.get('/machines', { adapter: answer401 }),
    ).rejects.toThrow();

    // O logout é um thunk: espera ele terminar antes de conferir
    await vi.waitFor(() =>
      expect(store.getState().auth).toMatchObject({
        token: null,
        error: 'Sua sessão expirou. Entre novamente.',
      }),
    );
    expect(tokenStorage.get()).toBeNull();
  });
});
