import { createMonitoringPointDto } from './create-monitoring-point.dto';

export type UpdateMonitoringPointDto = {
  name?: string;
  machineId?: number;
  sensorId?: number;
};

export const updateMonitoringPointDto = createMonitoringPointDto.partial();
