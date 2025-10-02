export interface SensorDataPoint {
  datetime: string;
  max: number;
}

export interface SensorData {
  name: string;
  data: SensorDataPoint[];
}

export interface SensorState {
  loading: boolean;
  error: string | null;
  data: SensorData[];
}
