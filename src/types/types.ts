export interface Machine {
  title: string;
  type: string;
  monitoringPoints: MonitoringPoint[];
  id: number | null;
}

export interface MonitoringPoint {
  name: string;
  sensorModel: string;
}
