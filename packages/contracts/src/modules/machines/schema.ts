import { z } from 'zod';

export const sensorSchema = z.object({
  id: z.string(),
  model: z.string(),
  serialNumber: z.string(),
  position: z.string(),
});

export const machineSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  manufacturer: z.string(),
  rpm: z.number(),
  status: z.enum(['operational', 'alert', 'critical', 'stopped']),
  sensor: sensorSchema,
  lastReadingAt: z.string(),
});

export const machinesListSchema = z.object({
  data: z.array(machineSchema),
});

export type Sensor = z.infer<typeof sensorSchema>;
export type Machine = z.infer<typeof machineSchema>;
export type MachineStatus = Machine['status'];
