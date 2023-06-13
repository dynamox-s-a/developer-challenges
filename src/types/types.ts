export interface Machine {
  title: string;
  type: string;
  monitoringPoints: MonitoringPoint[];
  id: number | null;
  userId: number;
}

export interface MonitoringPoint {
  title: string;
  sensor: string;
  machineId: number | null;
  machineType: string;
  machineTitle: string;
  userId: number;
}

export interface User {
  email: string;
}
