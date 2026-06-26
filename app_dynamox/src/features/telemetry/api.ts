import type { RawSeries } from './types';

const SERIES_COUNT = 7;

export async function fetchTelemetryData(): Promise<RawSeries[]> {
    const responses = await Promise.all(
        Array.from({ length: SERIES_COUNT }, (_, index) => fetch(`http://localhost:3000/${index}`))
    );

    for (const response of responses) {
        if (!response.ok) throw new Error('Falha ao buscar dados de telemetria');
    }

    return Promise.all(responses.map((response) => response.json()));
}
