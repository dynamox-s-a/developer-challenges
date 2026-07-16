import type { SensorSeries } from './series';

export type MeasurementRepository = {
  findByMachineId(machineId: string): Promise<SensorSeries[]>;
};
