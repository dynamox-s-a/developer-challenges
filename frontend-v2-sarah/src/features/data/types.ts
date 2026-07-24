export type ChartPoint = [number, number];

export interface MetricSeries {
  id: string;
  name: string;
  data: ChartPoint[];
}

export type MetricsResponse = MetricSeries[];

export interface MachineDataState {
  metrics: MetricSeries[];
  isLoading: boolean;
  error: string | null;
}
