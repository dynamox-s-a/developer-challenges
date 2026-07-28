import {
  ChartTitle,
  MetricUnit,
  YAxisTitle,
  type ChartData,
  type MetricsResponse,
} from '../features/data/types';
import type { ValidChart } from '../pages/Data/type';

export const mockChartDataAcceleration: ChartData = {
  category: 'acceleration',
  chartTitle: ChartTitle.ACCELERATION,
  yAxisTitle: YAxisTitle.ACCELERATION,
  unit: MetricUnit.MM_S,
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
};

export const mockChartDataTemperature: ChartData = {
  category: 'temperature',
  chartTitle: ChartTitle.TEMPERATURE,
  yAxisTitle: YAxisTitle.TEMPERATURE,
  unit: MetricUnit.CELSIUS,
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
};

export const mockChartDataVelocity: ChartData = {
  category: 'velocity',
  chartTitle: ChartTitle.VELOCITY,
  yAxisTitle: YAxisTitle.VELOCITY,
  unit: MetricUnit.G,
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
};

export const mockMetricsResponse: MetricsResponse = {
  accelerationRms: mockChartDataAcceleration,
  velocityRms: mockChartDataVelocity,
  temperature: mockChartDataTemperature,
};

export const mockValidCharts: ValidChart[] = [
  {
    id: 'accelleration',
    data: mockMetricsResponse.accelerationRms as ChartData,
  },
  { id: 'temperature', data: mockMetricsResponse.temperature as ChartData },
  { id: 'velocity', data: mockMetricsResponse.velocityRms as ChartData },
];
