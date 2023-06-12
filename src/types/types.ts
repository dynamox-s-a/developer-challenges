export interface Machine {
  title: string;
  type: string;
  monitoringPoints: MonitoringPoint[];
}

export interface MonitoringPoint {
  name: string;
  sensorModel: string;
}
