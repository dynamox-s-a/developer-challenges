import type { ChartData, MetricsResponse } from '../../features/data/types';

export const getValidCharts = (metrics: MetricsResponse | null | undefined) => {
  if (!metrics) return [];

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
