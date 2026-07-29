export interface ApiMetricPoint {
  datetime: string;
  max: number;
}

export interface ApiMetricSeries {
  name: string;
  data: ApiMetricPoint[];
}

export type RawMetricsResponse = ApiMetricSeries[];
