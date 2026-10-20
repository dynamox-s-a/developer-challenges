export const SERIES_NAMES = [
  "accelerationRms/x",
  "accelerationRms/y",
  "accelerationRms/z",
  "velocityRms/x",
  "velocityRms/y",
  "velocityRms/z",
  "temperature",
] as const;

export const AXIS_BY_SUFFIX = {
  x: "Axial",
  y: "Horizontal",
  z: "Radial",
} as const;

export type SeriesName = (typeof SERIES_NAMES)[number];

export type ChartPoint = [timestamp: number, value: number];
export type MetricKey = "acceleration" | "velocity" | "temperature";
export type AxisLabel = "Axial" | "Horizontal" | "Radial";

export type ChartSeries = {
  name: AxisLabel | "Temperatura";
  data: ChartPoint[];
};
export type ChartData = Record<MetricKey, ChartSeries[]>;
export type MachineInfo = MachineDto;

export type SeriesPointDto = {
  datetime: string;
  max: number;
};
export type SeriesDto = {
  name: SeriesName;
  data: SeriesPointDto[];
};

export type MachineDto = {
  name: string;
  point: string;
  sampleRate: number;
  interval: string;
  range: string;
};
