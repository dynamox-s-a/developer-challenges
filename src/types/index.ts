export interface DataPoint {
  datetime: string;
  max: number;
}

export interface AccelerationResponse {
  data: DataPoint[];
}

export interface TemperaturePoint {
  datetime: string;
  max: number;
}

export interface TemperatureResponse {
  name: string;
  data: TemperaturePoint[];
}

export interface VelocityRmsData {
  datetime: string;
  max: number;
}

export interface VelocityRmsResponse {
  name: string;
  data: VelocityRmsData[];
}

export interface PointData {
  datetime: string;
  max: number;
}
