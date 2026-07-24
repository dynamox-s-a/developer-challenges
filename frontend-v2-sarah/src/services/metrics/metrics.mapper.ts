import type { RawMetricsResponse } from './type';
import type { MetricsResponse, ChartPoint } from '../../features/data/types';

export const mapRawMetricsToMetricsResponse = (
  rawMetrics: RawMetricsResponse,
): MetricsResponse => {
  console.log('rawMetrics:', rawMetrics); // Adicione este log para depuração
  if (!Array.isArray(rawMetrics)) {
    return [];
  }

  return rawMetrics.map((metric, index) => ({
    id: `${metric.name.replace(/[^a-zA-Z0-9]/g, '')}-${index}`,
    name: metric.name,
    data: metric.data.map(
      (point) => [new Date(point.datetime).getTime(), point.max] as ChartPoint,
    ),
  }));
};
