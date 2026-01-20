import { MachineType } from '@/store/machine/machine.types';

export type SensorModel = 'TcAg' | 'TcAs' | 'HF+';

export interface Sensor {
  id: string;
  model: SensorModel;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  machineType: MachineType;
  machineName: string;
  sensor: Sensor;
}
