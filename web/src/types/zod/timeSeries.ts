import { z } from 'zod'
import { createResponseSchema } from '@/utils/createResponse'

export const TimeSeriesDataPointSchema = z.object({
  _id: z.string().optional(),
  monitoringPointId: z.string(),
  timestamp: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type TimeSeriesDataPoint = z.infer<typeof TimeSeriesDataPointSchema>

export const CreateTimeSeriesPointSchema = z.object({
  monitoringPointId: z.string(),
  timestamp: z.coerce.date(),
  value: z.coerce.number(),
  unit: z.string().nullable().default('').optional(),
})

export const CreateTimeSeriesBatchSchema = z.array(CreateTimeSeriesPointSchema)

export type CreateTimeSeriesPointDto = z.infer<
  typeof CreateTimeSeriesPointSchema
>
export type CreateTimeSeriesBatchDto = z.infer<
  typeof CreateTimeSeriesBatchSchema
>

export const TimeSeriesPaginatedResponseSchema = z.object({
  data: z.array(TimeSeriesDataPointSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

export type TimeSeriesPaginatedResponse = z.infer<
  typeof TimeSeriesPaginatedResponseSchema
>

export const TimeSeriesMetricsSchema = z.object({
  monitoringPointId: z.string(),
  count: z.number(),
  avg: z.number().nullable(),
  min: z.number().nullable(),
  max: z.number().nullable(),
  firstTimestamp: z.iso.datetime().nullable(),
  lastTimestamp: z.iso.datetime().nullable(),
})

export type TimeSeriesMetrics = z.infer<typeof TimeSeriesMetricsSchema>

export const CountResponseSchema = z.object({
  count: z.number(),
})

export const TimeSeriesDataPointResponseSchema = createResponseSchema(
  TimeSeriesDataPointSchema,
)

export type TimeSeriesDataPointResponse = z.infer<
  typeof TimeSeriesDataPointResponseSchema
>

export const TimeSeriesPaginatedResponseWrapperSchema = createResponseSchema(
  TimeSeriesPaginatedResponseSchema,
).extend({
  data: TimeSeriesPaginatedResponseSchema.optional(),
})

export type TimeSeriesPaginatedResponseWrapper = z.infer<
  typeof TimeSeriesPaginatedResponseWrapperSchema
>

export const TimeSeriesMetricsResponseSchema = createResponseSchema(
  TimeSeriesMetricsSchema,
).extend({
  data: TimeSeriesMetricsSchema.optional(),
})

export type TimeSeriesMetricsResponse = z.infer<
  typeof TimeSeriesMetricsResponseSchema
>
export const CountResponseWrapperSchema = createResponseSchema(
  CountResponseSchema,
).extend({
  data: CountResponseSchema.optional(),
})

export type CountResponseWrapper = z.infer<typeof CountResponseWrapperSchema>
