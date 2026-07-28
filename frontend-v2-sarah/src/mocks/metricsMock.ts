import {
  ChartTitle,
  MetricUnit,
  YAxisTitle,
  type ChartData,
  type MetricsResponse,
} from '../features/data/types';
import type { ValidChart } from '../pages/Data/type';

export const mockChartDataAcceleration: ChartData = {
  category: 'accelerationRms',
  chartTitle: ChartTitle.ACCELERATION,
  yAxisTitle: YAxisTitle.ACCELERATION,
  unit: MetricUnit.MM_S,
  series: [
    {
      id: 'accelerationRms-x-series-0',
      name: 'accelerationRms/x',
      label: 'Axial',
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
      id: 'temperature-series-6',
      name: 'temperature',
      label: 'Temperatura',
      color: '#e8de14',
      data: [
        [1625097600000, 10],
        [1625184000000, 20],
      ],
    },
  ],
};

export const mockChartDataVelocity: ChartData = {
  category: 'velocityRms',
  chartTitle: ChartTitle.VELOCITY,
  yAxisTitle: YAxisTitle.VELOCITY,
  unit: MetricUnit.G,
  series: [
    {
      id: 'velocityRms-x-series-3',
      name: 'velocityRms/x',
      label: 'Axial',
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
