import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('api.getData', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('requests /metrics and return JSON when response is ok', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000');

    const payload = { visitors: 123 };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(payload),
    });

    vi.stubGlobal('fetch', fetchMock);

    const { api } = await import('./api');
    await expect(api.getData()).resolves.toEqual(payload);

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/metrics');
  });

  it('throws an error when response is not ok', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000');

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn(),
    });

    vi.stubGlobal('fetch', fetchMock);

    const { api } = await import('./api');
    await expect(api.getData()).rejects.toThrow('Failed to fetch data');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/metrics');
  });
});
