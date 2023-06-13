export interface Machine {
  title: string;
  type: string;
  monitoringPoints: MonitoringPoint[];
  id: number;
}

export interface MonitoringPoint {
  title: string;
  sensor: string;
  machineId: number;
  machineType: string;
  machineTitle: string;
}
