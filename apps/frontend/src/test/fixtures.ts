import type { Machine, Metric, Series } from '@repo/contracts';

export const machineFixture: Machine = {
  id: 'MCH-001',
  name: 'Ventilador de Exaustão 01',
  type: 'Motor elétrico',
  manufacturer: 'WEG',
  rpm: 1780,
  status: 'alert',
  sensor: {
    id: 'SNR-8842',
    model: 'DynaLogger TcAg',
    serialNumber: 'HF-8842-2023',
    position: 'Mancal dianteiro',
  },
  lastReadingAt: '2023-12-12T15:02:42.000Z',
};

export const makeSeries = (
  id: string,
  metric: Metric,
  axis: Series['axis'],
  values: number[] = [1, 2, 3]
): Series => ({
  id,
  metric,
  axis,
  unit: metric === 'temperature' ? '°C' : metric === 'velocity' ? 'mm/s' : 'g',
  points: values.map((value, index) => ({
    datetime: new Date(Date.UTC(2023, 10, 7 + index)).toISOString(),
    max: value,
  })),
  stats: {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((sum, value) => sum + value, 0) / values.length,
    last: values[values.length - 1],
  },
});

export const seriesFixture: Series[] = [
  makeSeries('accelerationRms/x', 'acceleration', 'x'),
  makeSeries('accelerationRms/y', 'acceleration', 'y'),
  makeSeries('velocityRms/x', 'velocity', 'x'),
  makeSeries('temperature', 'temperature', null),
];
