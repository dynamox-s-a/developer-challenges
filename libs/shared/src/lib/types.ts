export enum MachineType {
  Pump = 'Pump',
  Fan = 'Fan',
}

export enum SensorModel {
  TcAg = 'TcAg',
  TcAs = 'TcAs',
  HFPlus = 'HF+',
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
  createdAt: Date;
  updatedAt: Date;
  monitoringPoints?: MonitoringPoint[];
}

export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  machine?: Machine;
  sensor?: Sensor;
  createdAt: Date;
}

export interface Sensor {
  id: string;
  model: SensorModel;
  monitoringPointId: string;
  monitoringPoint?: MonitoringPoint;
  createdAt: Date;
}

export interface TimeSeries {
  id: string;
  sensorId: string;
  value: number;
  timestamp: Date;
}

export interface CreateMachineDto {
  name: string;
  type: MachineType;
}

export interface UpdateMachineDto {
  name?: string;
  type?: MachineType;
}

export interface CreateMonitoringPointDto {
  name: string;
  machineId: string;
}

export interface CreateSensorDto {
  model: SensorModel;
  monitoringPointId: string;
}

export interface CreateTimeSeriesDto {
  sensorId: string;
  value: number;
  timestamp?: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MonitoringPointListItem {
  id: string;
  name: string;
  machineName: string;
  machineType: MachineType;
  sensorModel: SensorModel | null;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
