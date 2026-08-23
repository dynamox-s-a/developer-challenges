export interface Measurement {
  datetime: string;
  max: number;
}
export interface RawSeries {
  name: string;
  data: Measurement[];
}
export type TelemetryResponse = RawSeries[];
export type TelemetryStatus = "idle" | "loading" | "succeeded" | "failed";
export interface TelemetryState {
  data: TelemetryResponse;
  status: TelemetryStatus;
  error: string | null;
}
export interface ChartSeries {
  id: string;
  name: string;
  data: [number, number][];
}
export interface DashboardChart {
  id: "acceleration" | "temperature" | "velocity";
  title: string;
  unit: string;
  series: ChartSeries[];
}
