export interface MetricPoint {
  datetime: string;
  max: number;
}

export interface MetricSeries {
  name: string;
  data: MetricPoint[];
}

export type MetricsResponse = MetricSeries[];
