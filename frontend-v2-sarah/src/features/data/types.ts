export const ChartTitle = {
  ACCELERATION: 'Aceleração RMS',
  VELOCITY: 'Velocidade RMS',
  TEMPERATURE: 'Temperatura',
  GENERAL: 'Métrica',
} as const;
export type ChartTitle = (typeof ChartTitle)[keyof typeof ChartTitle];

export const MetricLabel = {
  AXIAL: 'Axial',
  HORIZONTAL: 'Horizontal',
  RADIAL: 'Radial',
  TEMPERATURE: 'Temperatura',
} as const;
export type MetricLabel =
  | (typeof MetricLabel)[keyof typeof MetricLabel]
  | string;

export const YAxisTitle = {
  ACCELERATION: 'Aceleração RMS (g)',
  VELOCITY: 'Aceleração (g)',
  TEMPERATURE: 'Temperatura (°C)',
  NONE: '',
} as const;
export type YAxisTitle = (typeof YAxisTitle)[keyof typeof YAxisTitle];

export const MetricUnit = {
  G: 'g',
  MM_S: 'mm/s',
  CELSIUS: '°C',
  NONE: '',
} as const;
export type MetricUnit = (typeof MetricUnit)[keyof typeof MetricUnit];

export type ChartPoint = [number, number];

export interface MetricSeries {
  id: string;
  name: string;
  label: MetricLabel;
  color: string;
  data: ChartPoint[];
}

export interface ChartData {
  category: string;
  chartTitle: ChartTitle;
  yAxisTitle: YAxisTitle;
  unit: MetricUnit;
  series: MetricSeries[];
}

export interface MetricsResponse {
  accelerationRms?: ChartData;
  velocityRms?: ChartData;
  temperature?: ChartData;
}

export interface MachineDataState {
  metrics: MetricsResponse;
  isLoading: boolean;
  error: string | null;
}
