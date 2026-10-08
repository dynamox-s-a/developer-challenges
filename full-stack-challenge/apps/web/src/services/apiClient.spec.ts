import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from 'axios';
import { apiClient, setUnauthorizedHandler, toApiError } from './apiClient';

/** An adapter that answers every request with the given status and body. */
function respondWith(status: number, data: unknown): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig) => {
    const response = {
      status,
      statusText: String(status),
      data,
      headers: {},
      config,
    };
    if (status < 400) return response;
    throw new AxiosError(
      `Request failed with status code ${status}`,
      AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      response,
    );
  };
}

const unauthorizedBody = {
  error: { code: 'UNAUTHORIZED', message: 'Session expired or invalid' },
};

describe('apiClient', () => {
  const onUnauthorized = vi.fn();

  beforeEach(() => {
    onUnauthorized.mockClear();
    setUnauthorizedHandler(onUnauthorized);
  });

  afterAll(() => setUnauthorizedHandler(null));

  it('sends the session cookie with every request', () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });

  it('targets the versioned API', () => {
    expect(apiClient.defaults.baseURL).toMatch(/\/api\/v1$/);
  });

  it('calls the unauthorized handler when a private route answers 401', async () => {
    await expect(
      apiClient.get('/machines', {
        adapter: respondWith(401, unauthorizedBody),
      }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it.each(['/auth/login', '/auth/me'])(
    'treats a 401 from %s as an answer, not an expired session',
    async (url) => {
      await expect(
        apiClient.get(url, { adapter: respondWith(401, unauthorizedBody) }),
      ).rejects.toBeInstanceOf(AxiosError);
      expect(onUnauthorized).not.toHaveBeenCalled();
    },
  );

  it('ignores errors other than 401', async () => {
    await expect(
      apiClient.get('/machines', { adapter: respondWith(403, {}) }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('passes successful responses through', async () => {
    const response = await apiClient.get('/machines', {
      adapter: respondWith(200, { data: [] }),
    });
    expect(response.data).toEqual({ data: [] });
    expect(onUnauthorized).not.toHaveBeenCalled();
  });
});

describe('toApiError', () => {
  function axiosErrorWith(status: number, data: unknown): AxiosError {
    const config = { headers: new AxiosHeaders() };
    return new AxiosError('Request failed', undefined, config, null, {
      status,
      statusText: String(status),
      data,
      headers: {},
      config,
    });
  }

  it('unwraps the API error body', () => {
    const details = [{ path: 'name', message: 'Required' }];
    expect(
      toApiError(
        axiosErrorWith(400, {
          error: { code: 'VALIDATION_ERROR', message: 'Invalid', details },
        }),
      ),
    ).toEqual({
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid',
      details,
    });
  });

  it('keeps the status when the body is not the API shape', () => {
    expect(toApiError(axiosErrorWith(502, '<html>Bad gateway</html>'))).toEqual(
      { status: 502, code: 'HTTP_ERROR', message: 'Request failed' },
    );
  });

  it('reports a request that got no response as a network error', () => {
    const error = new AxiosError('Network Error', AxiosError.ERR_NETWORK);
    expect(toApiError(error)).toMatchObject({
      status: null,
      code: 'NETWORK_ERROR',
    });
  });

  it('wraps anything else', () => {
    expect(toApiError(new Error('boom'))).toEqual({
      status: null,
      code: 'UNKNOWN_ERROR',
      message: 'boom',
    });
    expect(toApiError('nope')).toMatchObject({ code: 'UNKNOWN_ERROR' });
  });
});
