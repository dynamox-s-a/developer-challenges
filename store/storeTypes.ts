export interface Machine {
  title: string;
  type: string;
  monitoringPoints: MonitoringPoint[];
  id: number;
}

export interface MonitoringPoint {
  name: string;
  sensorModel: string;
}
