export interface Machine {
  id: number;
  name: string;
  type: 'Pump' | 'Fan';
  createdAt: Date;
}

export interface Sensor {
  id: number;
  model: string;
}

export interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  createdAt: Date;
  sensor: Sensor | null;
  machine: Machine;
}

export interface PaginatedMonitoringPoints {
  data: MonitoringPoint[];
  total: number;
  totalMachines: number;
  totalPages: number;
  page: number;
}

export type SortColumn = 'machine_name' | 'machine_type' | 'monitoring_point_name' | 'sensor_model';
export type SortOrder = 'asc' | 'desc';

export interface PaginatedMonitoringPointsQuery {
  page?: number;
  sortBy?: SortColumn;
  sortOrder?: SortOrder;
}
