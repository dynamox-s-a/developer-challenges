import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchAllMetrics } from '../api';

describe('api', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch data from all indices (0 to 6)', async () => {
    const mockData = { name: 'test', data: [] };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchAllMetrics();
    expect(result).toHaveLength(7);
    expect(result[0]).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(7);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/0', {
      headers: { 'Accept': 'application/json' },
    });
  });

  it('should throw error if any request fails', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValue({ ok: true, json: async () => ({}) });

    await expect(fetchAllMetrics()).rejects.toThrow('Erro ao buscar /1: 404');
  });
});