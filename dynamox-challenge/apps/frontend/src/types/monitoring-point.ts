import { Machine } from './machine';

export interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  machine?: Machine;
  _count?: {
    sensors: number;
  };
}
