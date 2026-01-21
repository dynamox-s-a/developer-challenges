export type SensorModel = 'TcAg' | 'TcAs' | 'HF+';

export interface Sensor {
  id: string;
  model: SensorModel;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  sensor: Sensor;
}
