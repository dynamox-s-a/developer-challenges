import { fetchTelemetryData } from '../api';
import type { RawSeries } from '../types';

const mockSeries: RawSeries[] = Array.from({ length: 7 }, (_, index) => ({
    name: `series/${index}`,
    data: [],
}));

const mockFetch = (ok: boolean, data?: unknown) =>
    Promise.resolve({
        ok,
        json: () => Promise.resolve(data),
    } as Response);

describe('fetchTelemetryData', () => {
    it('should return series on success', async () => {
        global.fetch = vi.fn(() => mockFetch(true, mockSeries)) as typeof fetch;

        const result = await fetchTelemetryData();

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/telemetry');
        expect(result).toEqual(mockSeries);
    });

    it('should throw an error when response is not ok', async () => {
        global.fetch = vi.fn(() => mockFetch(false)) as typeof fetch;

        await expect(fetchTelemetryData()).rejects.toThrow('Falha ao buscar dados de telemetria');
    });
});
