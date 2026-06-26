import type { RawSeries } from './telemetry.types';

export type ChartGroup = {
    title: string;
    unit: string;
    series: RawSeries[];
};

export function groupByMetric(series: RawSeries[]): ChartGroup[] {
    return [
        {
            title: 'Aceleração RMS',
            unit: 'Aceleração RMS (g)',
            series: series.filter((serie) => serie.name.startsWith('accelerationRms')),
        },
        {
            title: 'Temperatura',
            unit: 'Temperatura (°C)',
            series: series.filter((serie) => serie.name === 'temperature'),
        },
        {
            title: 'Velocidade RMS',
            unit: 'Velocidade RMS (g)',
            series: series.filter((serie) => serie.name.startsWith('velocityRms')),
        },
    ];
}
