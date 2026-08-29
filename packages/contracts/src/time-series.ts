import { z } from "zod";

import { idSchema, isoDateTimeSchema, nameSchema, paginationSchema } from "./common.js";
import { sensorIdSchema } from "./monitoring-points.js";

export const TIME_SERIES_MAX_SAMPLES = 10_000;

export const timeSeriesSampleSchema = z
  .object({
    timestamp: isoDateTimeSchema,
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
  })
  .strict();

export const createTimeSeriesRequestSchema = z
  .object({
    label: nameSchema.optional(),
    samples: z.array(timeSeriesSampleSchema).min(1).max(TIME_SERIES_MAX_SAMPLES),
  })
  .strict();

export const timeSeriesSummarySchema = z.object({
  id: idSchema,
  monitoringPointId: idSchema,
  sensorId: sensorIdSchema,
  label: nameSchema.nullable(),
  sampleCount: z.number().int().positive(),
  startedAt: isoDateTimeSchema,
  endedAt: isoDateTimeSchema,
  createdAt: isoDateTimeSchema,
});

export const timeSeriesListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  monitoringPointId: idSchema.optional(),
});

export const timeSeriesListResponseSchema = paginationSchema.extend({
  items: z.array(timeSeriesSummarySchema),
});

export const timeSeriesDetailSchema = timeSeriesSummarySchema.extend({
  samples: z.array(timeSeriesSampleSchema),
});

export const axisMetricsSchema = z.object({
  min: z.number(),
  max: z.number(),
  mean: z.number(),
  rms: z.number().nonnegative(),
});

export const timeSeriesMetricsSchema = z.object({
  seriesId: idSchema,
  sampleCount: z.number().int().positive(),
  startedAt: isoDateTimeSchema,
  endedAt: isoDateTimeSchema,
  axes: z.object({
    x: axisMetricsSchema,
    y: axisMetricsSchema,
    z: axisMetricsSchema,
  }),
  vectorMagnitudeRms: z.number().nonnegative(),
});

export type TimeSeriesSample = z.infer<typeof timeSeriesSampleSchema>;
export type CreateTimeSeriesRequest = z.infer<typeof createTimeSeriesRequestSchema>;
export type TimeSeriesSummary = z.infer<typeof timeSeriesSummarySchema>;
export type TimeSeriesListQuery = z.infer<typeof timeSeriesListQuerySchema>;
export type TimeSeriesListResponse = z.infer<typeof timeSeriesListResponseSchema>;
export type TimeSeriesDetail = z.infer<typeof timeSeriesDetailSchema>;
export type AxisMetrics = z.infer<typeof axisMetricsSchema>;
export type TimeSeriesMetrics = z.infer<typeof timeSeriesMetricsSchema>;
