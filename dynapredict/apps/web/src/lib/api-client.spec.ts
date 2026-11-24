import { AxiosError, type AxiosAdapter, type AxiosResponse } from 'axios';
import { api, getApiErrorMessage, setOnUnauthorized } from './api-client';
import { tokenStorage } from './token-storage';

// "Servidor de mentira": em vez de ir para a rede, devolve o cabeçalho
// Authorization que a requisição levaria
const echoAuthorization: AxiosAdapter = async (config) => ({
  data: config.headers.Authorization ?? null,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
});

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

describe('api client', () => {
  beforeEach(() => localStorage.clear());

  it('should send the saved token in the Authorization header', async () => {
    tokenStorage.set('token-123');

    const { data } = await api.get('/qualquer', { adapter: echoAuthorization });

    expect(data).toBe('Bearer token-123');
  });

  it('should not send the Authorization header when there is no token', async () => {
    const { data } = await api.get('/qualquer', { adapter: echoAuthorization });

    expect(data).toBeNull();
  });

  it('should warn when the api answers 401', async () => {
    const onUnauthorized = vi.fn();
    setOnUnauthorized(onUnauthorized);

    await expect(
      api.get('/machines', { adapter: answer401 }),
    ).rejects.toThrow();

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('should not warn on a 401 from the login (wrong password)', async () => {
    const onUnauthorized = vi.fn();
    setOnUnauthorized(onUnauthorized);

    await expect(
      api.post('/auth/login', {}, { adapter: answer401 }),
    ).rejects.toThrow();

    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});

describe('getApiErrorMessage', () => {
  it('should return the message sent by the api', () => {
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

    expect(getApiErrorMessage(error)).toBe('E-mail ou senha inválidos');
  });

  it('should explain when the api did not respond', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK');

    expect(getApiErrorMessage(error)).toBe(
      'Não foi possível conectar ao servidor',
    );
  });

  it('should fall back to a generic message for other errors', () => {
    expect(getApiErrorMessage(new Error('qualquer coisa'))).toBe(
      'Erro inesperado',
    );
  });
});
