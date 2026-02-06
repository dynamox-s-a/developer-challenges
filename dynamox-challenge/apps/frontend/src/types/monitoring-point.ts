import { Machine } from './machine';
import { Sensor } from './sensor';

export interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  machine?: Machine;
  sensors?: Sensor[];
  _count?: {
    sensors: number;
  };
}

