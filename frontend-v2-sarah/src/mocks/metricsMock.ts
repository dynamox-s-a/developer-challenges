import {
  ChartTitle,
  MetricLabel,
  MetricUnit,
  YAxisTitle,
  type ChartData,
  type MetricsResponse,
} from '../features/data/types';
import type { ValidChart } from '../pages/Data/type';
import theme from '../theme/theme';

export const mockChartDataThreeLines: ChartData = {
  category: 'accelerationRms',
  chartTitle: ChartTitle.ACCELERATION,
  yAxisTitle: YAxisTitle.ACCELERATION,
  unit: MetricUnit.G,
  series: [
    {
      id: 'accelerationRms-x-series-0',
      name: 'accelerationRms/x',
      label: MetricLabel.AXIAL,
      color: theme.palette.charts.accelerationX,
      data: [
        [1625097600000, 10],
        [1625184000000, 20],
        [1625270400000, 5],
        [1625356800000, 25],
      ],
    },
    {
      id: 'accelerationRms-x-series-1',
      name: 'accelerationRms/x',
      label: MetricLabel.HORIZONTAL,
      color: theme.palette.charts.accelerationY,
      data: [
        [1625097600000, 35],
        [1625184000000, 30],
        [1625270400000, 37],
        [1625356800000, 45],
      ],
    },
    {
      id: 'accelerationRms-x-series-2',
      name: 'accelerationRms/x',
      label: MetricLabel.RADIAL,
      color: theme.palette.charts.accelerationZ,
      data: [
        [1625097600000, 10],
        [1625184000000, 5],
        [1625270400000, 10],
        [1625356800000, 5],
      ],
    },
  ],
};

export const mockChartDataAcceleration: ChartData = {
  category: 'accelerationRms',
  chartTitle: ChartTitle.ACCELERATION,
  yAxisTitle: YAxisTitle.ACCELERATION,
  unit: MetricUnit.MM_S,
  series: [
    {
      id: 'accelerationRms-x-series-0',
      name: 'accelerationRms/x',
      label: MetricLabel.AXIAL,
      color: theme.palette.charts.accelerationX,
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
      label: MetricLabel.TEMPERATURE,
      color: theme.palette.charts.temperature,
      data: [
        [1625097600000, 30],
        [1625184000000, 35],
        [1625270400000, 25],
        [1625356800000, 20],
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
      label: MetricLabel.AXIAL,
      color: theme.palette.charts.velocityX,
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
