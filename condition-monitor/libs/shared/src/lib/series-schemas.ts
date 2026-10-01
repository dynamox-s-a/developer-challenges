import { z } from 'zod';
import type { Axis, Quantity } from './quantity.js';
import { readingTimestampSchema } from './reading-schemas.js';

/** The most points a chart asks for; each bucket returns two, its minimum and maximum. */
export const MAX_POINTS_LIMIT = 5_000;

/**
 * An interval of a series, both ends included and both optional: without `from` it
 * starts at the first reading, without `to` it ends at the last.
 */
export const timeRangeQuerySchema = z
  .object({
    from: readingTimestampSchema.optional(),
    to: readingTimestampSchema.optional(),
  })
  .refine((range) => !range.from || !range.to || range.from <= range.to, {
    path: ['to'],
    message: 'Must not be before from.',
  });

/** Query of `GET /api/time-series/:id/readings`. */
export const readingsQuerySchema = z
  .object({
    from: readingTimestampSchema.optional(),
    to: readingTimestampSchema.optional(),
    maxPoints: z.coerce
      .number({ error: `Must be a whole number from 2 to ${MAX_POINTS_LIMIT}.` })
      .int(`Must be a whole number from 2 to ${MAX_POINTS_LIMIT}.`)
      .min(2, `Must be a whole number from 2 to ${MAX_POINTS_LIMIT}.`)
      .max(MAX_POINTS_LIMIT, `Must be a whole number from 2 to ${MAX_POINTS_LIMIT}.`)
      .optional(),
  })
  .refine((range) => !range.from || !range.to || range.from <= range.to, {
    path: ['to'],
    message: 'Must not be before from.',
  });

export type TimeRangeQuery = z.infer<typeof timeRangeQuerySchema>;
export type ReadingsQuery = z.infer<typeof readingsQuerySchema>;

/** A series as listed on its monitoring point (C1). Unit and label are derived (C10). */
export interface TimeSeriesSummary {
  id: string;
  monitoringPointId: string;
  quantity: Quantity;
  axis: Axis | null;
  unit: string;
  label: string;
  readingCount: number;
  /** Null while the series holds no reading. */
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

/**
 * Metrics of a series or of an interval of it (C6). With no reading, `count` is 0 and
 * every other field is null: unknown, never a zero that was not measured (C7).
 */
export interface SeriesMetrics {
  count: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  /** Population standard deviation. */
  stdDev: number | null;
  rms: number | null;
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

export interface ReadingPoint {
  timestamp: string;
  value: number;
}

/** Minimum and maximum of the readings in `[start, end)`, the last bucket closed at `end`. */
export interface ReadingBucket {
  start: string;
  end: string;
  min: number;
  max: number;
  count: number;
}

/**
 * Readings of an interval: every reading, or, when there are more than `maxPoints`,
 * buckets with their minimum and maximum. An average would hide the peaks, and a
 * vibration peak is what the operator needs to see. Empty buckets are left out, so a
 * gap in the data stays a gap in the chart.
 */
export type ReadingsAnswer =
  | { downsampled: false; readings: ReadingPoint[] }
  | { downsampled: true; buckets: ReadingBucket[] };

/** Counts of the authenticated user, for the overview screen (E1). */
export interface Overview {
  sectors: number;
  machines: number;
  monitoringPoints: number;
  sensors: number;
  timeSeries: number;
  readings: number;
}
