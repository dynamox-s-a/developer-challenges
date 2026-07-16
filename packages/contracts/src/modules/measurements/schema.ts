import { z } from 'zod';

export const metricSchema = z.enum(['acceleration', 'velocity', 'temperature']);

export const axisSchema = z.enum(['x', 'y', 'z']);

export const dataPointSchema = z.object({
  datetime: z.string(),
  max: z.number(),
});

export const seriesStatsSchema = z.object({
  min: z.number(),
  max: z.number(),
  avg: z.number(),
  last: z.number(),
});

export const seriesSchema = z.object({
  id: z.string(),
  metric: metricSchema,
  axis: axisSchema.nullable(),
  unit: z.string(),
  points: z.array(dataPointSchema),
  stats: seriesStatsSchema,
});

export const measurementsQuerySchema = z.object({
  machineId: z.string(),
  from: z.string().optional(),
  to: z.string().optional(),
  metrics: z.array(metricSchema).optional(),
});

export const measurementsSchema = z.object({
  machineId: z.string(),
  series: z.array(seriesSchema),
});

export type Metric = z.infer<typeof metricSchema>;
export type Axis = z.infer<typeof axisSchema>;
export type DataPoint = z.infer<typeof dataPointSchema>;
export type SeriesStats = z.infer<typeof seriesStatsSchema>;
export type Series = z.infer<typeof seriesSchema>;
export type Measurements = z.infer<typeof measurementsSchema>;
export type MeasurementsQuery = z.infer<typeof measurementsQuerySchema>;
