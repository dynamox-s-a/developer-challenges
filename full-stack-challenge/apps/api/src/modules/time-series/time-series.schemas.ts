import { z } from 'zod';

const isoDateTime = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid ISO date-time');

export const createReadingsSchema = z.object({
  readings: z
    .array(
      z.object({
        timestamp: isoDateTime,
        value: z.number().finite(),
      })
    )
    .min(1)
    .max(5000),
});

export const readingsRangeQuerySchema = z.object({
  from: isoDateTime.optional(),
  to: isoDateTime.optional(),
});

export const forecastQuerySchema = z.object({
  horizon: z.coerce.number().int().min(1).max(120).default(12),
});

export type CreateReadingsInput = z.infer<typeof createReadingsSchema>;
export type ReadingsRangeQuery = z.infer<typeof readingsRangeQuerySchema>;
export type ForecastQuery = z.infer<typeof forecastQuerySchema>;
