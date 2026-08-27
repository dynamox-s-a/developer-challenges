import { z } from 'zod';
import { SensorModel } from '@dynamox/shared';

export const createMonitoringPointSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const associateSensorSchema = z.object({
  sensorId: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, 'sensorId must be alphanumeric (dash/underscore allowed)'),
  model: z.nativeEnum(SensorModel),
});

export const listMonitoringPointsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
  sortBy: z
    .enum(['machineName', 'machineType', 'name', 'sensorModel'])
    .default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type CreateMonitoringPointInput = z.infer<typeof createMonitoringPointSchema>;
export type AssociateSensorInput = z.infer<typeof associateSensorSchema>;
export type ListMonitoringPointsQuery = z.infer<typeof listMonitoringPointsQuerySchema>;
