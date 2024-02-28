import { z } from 'zod';

export type CreateMonitoringPointDto = {
  name: string;
  machineId: number;
  sensorId: number;
};

export const createMonitoringPointDto = z.object({
  name: z.string(),
  machineId: z.number(),
  sensorId: z.number(),
});
