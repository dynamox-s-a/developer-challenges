import type { ChartData, MetricsResponse } from '../../features/data/types';
import type { ValidChart } from './type';

export const getValidCharts = (metrics: MetricsResponse): ValidChart[] => {
  if (!metrics || Object.keys(metrics).length === 0) return [];

  const chartMetricsData = [
    { id: 'accelleration', data: metrics?.accelerationRms },
    { id: 'temperature', data: metrics?.temperature },
    { id: 'velocity', data: metrics?.velocityRms },
  ];

  return chartMetricsData.filter(
    (metric): metric is { id: string; data: ChartData } =>
      metric.data !== undefined && metric.data !== null,
  );
};
