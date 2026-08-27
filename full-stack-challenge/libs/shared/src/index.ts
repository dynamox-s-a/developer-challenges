export enum MachineType {
  Pump = 'Pump',
  Fan = 'Fan',
}

export enum SensorModel {
  TcAg = 'TcAg',
  TcAs = 'TcAs',
  HFPlus = 'HF+',
}

/** Sensor models not allowed on Pump machines */
export const PUMP_FORBIDDEN_SENSORS: SensorModel[] = [
  SensorModel.TcAg,
  SensorModel.TcAs,
];

export function isSensorAllowedForMachine(
  machineType: MachineType,
  sensorModel: SensorModel
): boolean {
  if (machineType === MachineType.Pump) {
    return !PUMP_FORBIDDEN_SENSORS.includes(sensorModel);
  }
  return true;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface MachineDto {
  id: string;
  name: string;
  type: MachineType;
  monitoringPointsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMachineRequest {
  name: string;
  type: MachineType;
}

export interface UpdateMachineRequest {
  name?: string;
  type?: MachineType;
}

export interface MonitoringPointDto {
  id: string;
  name: string;
  machineId: string;
  machineName: string;
  machineType: MachineType;
  sensorModel: SensorModel | null;
  sensorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMonitoringPointRequest {
  name: string;
}

export interface AssociateSensorRequest {
  sensorId: string;
  model: SensorModel;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type MonitoringPointSortField =
  | 'machineName'
  | 'machineType'
  | 'name'
  | 'sensorModel';

export type SortOrder = 'asc' | 'desc';

export interface ListMonitoringPointsParams {
  page?: number;
  limit?: number;
  sortBy?: MonitoringPointSortField;
  order?: SortOrder;
}

export interface SensorReadingDto {
  id: string;
  monitoringPointId: string;
  timestamp: string;
  value: number;
}

export interface CreateSensorReadingsRequest {
  readings: Array<{
    timestamp: string;
    value: number;
  }>;
}

export interface SensorMetricsDto {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
}

export interface TimeSeriesRangeParams {
  from?: string;
  to?: string;
}

export interface DeleteReadingsResponse {
  deletedCount: number;
}

export interface ReadingsCountResponse {
  count: number;
}

export interface ForecastPointDto {
  timestamp: string;
  value: number;
}

export interface TimeSeriesForecastDto {
  method: 'linear-regression';
  horizon: number;
  intervalMs: number;
  historyCount: number;
  predictions: ForecastPointDto[];
}

export interface ForecastQueryParams {
  horizon?: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: string[];
}
