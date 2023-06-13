export interface Machine {
  title: string;
  type: string;
  monitoringPoints: MonitoringPoint[];
  id: number;
  userId: number;
}

export interface MonitoringPoint {
  title: string;
  sensor: string;
  machineId: number;
  machineType: string;
  machineTitle: string;
  userId: number;
}

export interface User {
  email: string;
  id: number | null;
}
