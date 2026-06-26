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
    it('should return 7 series on success', async () => {
        global.fetch = vi.fn((url: string) => {
            const index = Number(url.split('/').pop());

            return mockFetch(true, mockSeries[index]);
        }) as typeof fetch;

        const result = await fetchTelemetryData();

        expect(result).toHaveLength(7);
        expect(result).toEqual(mockSeries);
    });

    it('should throw an error when any response is not ok', async () => {
        global.fetch = vi.fn(() => mockFetch(false)) as typeof fetch;

        await expect(fetchTelemetryData()).rejects.toThrow('Falha ao buscar dados de telemetria');
    });
});
