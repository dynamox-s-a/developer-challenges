import type { RawSeries } from './types';

export async function fetchTelemetryData(): Promise<RawSeries[]> {
    const response = await fetch('http://localhost:3000/telemetry');

    if (!response.ok) throw new Error('Falha ao buscar dados de telemetria');

    return response.json();
}
