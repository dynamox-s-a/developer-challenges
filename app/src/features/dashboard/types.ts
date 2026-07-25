export type MeasurementPoint = {
  datetime: string;
  max: number;
};

export type MeasurementSeries = {
  name: string;
  data: MeasurementPoint[];
};

export type MetricKind = "acceleration" | "velocity" | "temperature";

export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";
