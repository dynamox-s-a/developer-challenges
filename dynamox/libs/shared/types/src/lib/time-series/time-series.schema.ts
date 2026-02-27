/**
 * @fileoverview Time Series schemas shared between API and Web App.
 * Defines runtime validation schemas and derived TypeScript types
 * for TimeSeries request/response contracts.
 */
import { Type, Static } from '@sinclair/typebox';

// Model Schemas

export const TimeSeriesSchema = Type.Object({
  id: Type.Number(),
  uuid: Type.String(),
  temperature: Type.Number(),
  accelerationRms: Type.Number(),
  velocityRms: Type.Number(),
  timestamp: Type.String({ format: 'date-time' }),
  sensorId: Type.Number(),
});

export const TimeSeriesEntrySchema = Type.Object({
  uuid: Type.String(),
  temperature: Type.Number(),
  accelerationRms: Type.Number(),
  velocityRms: Type.Number(),
  timestamp: Type.String({ format: 'date-time' }),
});

// Params Schemas

export const TimeSeriesSensorParamsSchema = Type.Object({
  sensorUuid: Type.String({ format: 'uuid' }),
});

// Query Schemas

export const TimeSeriesMetricsQuerySchema = Type.Object({
  startDate: Type.Optional(Type.String({ format: 'date-time' })),
  endDate: Type.Optional(Type.String({ format: 'date-time' })),
});

// Query Schemas

export const DeleteTimeSeriesByRangeQuerySchema = Type.Object({
  startDate: Type.String({ format: 'date-time' }),
  endDate: Type.String({ format: 'date-time' }),
});

// Request Schemas

export const DeleteTimeSeriesByUuidsRequestSchema = Type.Object({
  uuids: Type.Array(Type.String({ format: 'uuid' }), { minItems: 1 }),
});

export const CreateTimeSeriesRequestSchema = Type.Object({
  temperature: Type.Number(),
  accelerationRms: Type.Number(),
  velocityRms: Type.Number(),
  timestamp: Type.Optional(Type.String({ format: 'date-time' })),
});

export const CreateTimeSeriesBatchRequestSchema = Type.Array(
  CreateTimeSeriesRequestSchema,
  { minItems: 1 },
);

// Response Schemas

export const CreateTimeSeriesResponseSchema = TimeSeriesEntrySchema;

export const TimeSeriesListResponseSchema = Type.Object({
  timeSeries: Type.Array(TimeSeriesEntrySchema),
});

export const TimeSeriesMetricsResponseSchema = Type.Object({
  temperature: Type.Object({
    min: Type.Union([Type.Number(), Type.Null()]),
    max: Type.Union([Type.Number(), Type.Null()]),
    avg: Type.Union([Type.Number(), Type.Null()]),
  }),
  accelerationRms: Type.Object({
    min: Type.Union([Type.Number(), Type.Null()]),
    max: Type.Union([Type.Number(), Type.Null()]),
    avg: Type.Union([Type.Number(), Type.Null()]),
  }),
  velocityRms: Type.Object({
    min: Type.Union([Type.Number(), Type.Null()]),
    max: Type.Union([Type.Number(), Type.Null()]),
    avg: Type.Union([Type.Number(), Type.Null()]),
  }),
  count: Type.Number(),
});

export const TimeSeriesCountResponseSchema = Type.Object({
  count: Type.Number(),
});

export const DeleteTimeSeriesByUuidsResponseSchema = Type.Object({
  requested: Type.Number(),
  deleted: Type.Number(),
});

// Types

export type TimeSeries = Static<typeof TimeSeriesSchema>;
export type TimeSeriesEntry = Static<typeof TimeSeriesEntrySchema>;
export type CreateTimeSeriesRequest = Static<typeof CreateTimeSeriesRequestSchema>;
export type CreateTimeSeriesBatchRequest = Static<typeof CreateTimeSeriesBatchRequestSchema>;
export type TimeSeriesSensorParams = Static<typeof TimeSeriesSensorParamsSchema>;
export type CreateTimeSeriesResponse = Static<typeof CreateTimeSeriesResponseSchema>;
export type TimeSeriesListResponse = Static<typeof TimeSeriesListResponseSchema>;
export type TimeSeriesMetricsResponse = Static<typeof TimeSeriesMetricsResponseSchema>;
export type TimeSeriesCountResponse = Static<typeof TimeSeriesCountResponseSchema>;
export type TimeSeriesMetricsQuery = Static<typeof TimeSeriesMetricsQuerySchema>;
export type DeleteTimeSeriesByRangeQuery = Static<typeof DeleteTimeSeriesByRangeQuerySchema>;
export type DeleteTimeSeriesByUuidsRequest = Static<typeof DeleteTimeSeriesByUuidsRequestSchema>;
export type DeleteTimeSeriesByUuidsResponse = Static<typeof DeleteTimeSeriesByUuidsResponseSchema>;
