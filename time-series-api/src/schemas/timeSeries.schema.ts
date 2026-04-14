import { z } from 'zod';

const isoTimestampRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export const sampleSchema = z.object({
  timestamp: z
    .string()
    .regex(isoTimestampRegex, 'timestamp must be a valid ISO 8601 UTC string')
    .transform((value) => new Date(value))
    .refine((value) => !Number.isNaN(value.getTime()), 'timestamp is invalid')
    .refine((value) => value.getTime() <= Date.now(), 'timestamp cannot be in the future'),
  value: z.number(),
});

export const createTimeSeriesSchema = z.object({
  name: z.string().trim().max(100).optional(),
  samples: z.array(sampleSchema).min(1, 'samples must contain at least one item'),
});

export const timeSeriesIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid time series id'),
});

export type CreateTimeSeriesInput = z.infer<typeof createTimeSeriesSchema>;
export type TimeSeriesIdParamsInput = z.infer<typeof timeSeriesIdParamsSchema>; 