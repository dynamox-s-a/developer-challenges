export interface Machine {
  id: number;
  name: string;
  type: 'Pump' | 'Fan';
  createdAt: Date;
}

export interface Sensor {
  id: number;
  name: string;
}

export interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  machineName: string;
  sensor: Sensor;
}
