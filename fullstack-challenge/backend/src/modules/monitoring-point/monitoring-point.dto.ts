import { MonitoringPointType } from 'src/entities/monitoring-point.entity';

export type CreateMonitoringPointDto = {
  name: string;
  type: MonitoringPointType;
  machineId: number;
};

export type UpdateMonitoringPointDto = {
  name: string;
  type: MonitoringPointType;
  machineId: number;
};
