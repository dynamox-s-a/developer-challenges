import { ChartTitle, YAxisTitle, type MetricsResponse } from './types';

export const mockMetrics: MetricsResponse = {
  accelerationRms: {
    category: 'accelleration',
    chartTitle: ChartTitle.ACCELERATION,
    yAxisTitle: YAxisTitle.ACCELERATION,
    unit: 'g',
    series: [
      {
        id: '1',
        name: 'accelleration',
        label: 'Série A',
        color: '#e8de14',
        data: [
          [1625097600000, 10],
          [1625184000000, 20],
        ],
      },
    ],
  },
  velocityRms: {
    category: 'velocity',
    chartTitle: ChartTitle.VELOCITY,
    yAxisTitle: YAxisTitle.VELOCITY,
    unit: 'g',
    series: [
      {
        id: '1',
        name: 'velocity',
        label: 'Série A',
        color: '#e8de14',
        data: [
          [1625097600000, 10],
          [1625184000000, 20],
        ],
      },
    ],
  },
  temperature: {
    category: 'temperature',
    chartTitle: ChartTitle.TEMPERATURE,
    yAxisTitle: YAxisTitle.TEMPERATURE,
    unit: 'g',
    series: [
      {
        id: '1',
        name: 'temperature',
        label: 'Série A',
        color: '#e8de14',
        data: [
          [1625097600000, 10],
          [1625184000000, 20],
        ],
      },
    ],
  },
} as MetricsResponse;
