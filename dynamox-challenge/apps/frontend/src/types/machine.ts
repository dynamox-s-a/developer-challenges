import { MonitoringPoint } from './monitoring-point';

export interface Machine {
  id: number;
  name: string;
  type: string;
  status?: string;
  monitoringPoints?: MonitoringPoint[];
}
