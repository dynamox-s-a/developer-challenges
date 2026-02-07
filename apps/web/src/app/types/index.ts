export interface User {
  id: string;
  email: string;
}

export interface Machine {
  id: string;
  name: string;
  type: 'Pump' | 'Fan';
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  machine: Machine;
  sensor?: Sensor;
  createdAt: string;
}

export interface Sensor {
  id: string;
  model: 'TcAg' | 'TcAs' | 'HF+';
  monitoringPointId: string;
  monitoringPoint?: MonitoringPoint;
  createdAt: string;
}

export interface TimeSeriesPoint {
  id: string;
  sensorId: string;
  value: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
