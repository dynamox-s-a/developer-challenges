import { z } from "zod";
import { measurementMetricSchema } from "./measurement";
import type { MeasurementMetric } from "./measurement";

/**
 * Largest batch one request may carry.
 *
 * Set by the latency budget, not by taste: ingestion costs roughly 66 ms per
 * 1 000 readings, and the requirement is that a request stay under 350 ms.
 * 4 000 readings measure ~265 ms (max 286). The ceiling moved down from 5 000
 * when readings gained their `metric`, which made each one ~37% larger —
 * 5 000 then measured ~347 ms, over the budget.
 */
export const MAX_READINGS_PER_BATCH = 4000;

const timestampSchema = z.iso
  .datetime({
    offset: true,
    message: "Timestamp must be an ISO 8601 date-time with a time zone",
  })
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Timestamp is not a valid date",
  });

export const readingSchema = z.object({
  timestamp: timestampSchema,
  value: z.number(),
  // Required: a sample whose quantity is unknown cannot be charted against an
  // axis, and guessing one would misrepresent the data.
  metric: measurementMetricSchema,
});
export type Reading = z.infer<typeof readingSchema>;

export const createReadingsSchema = z.object({
  readings: z
    .array(readingSchema)
    .min(1, "Send at least one reading")
    .max(
      MAX_READINGS_PER_BATCH,
      `Send at most ${MAX_READINGS_PER_BATCH} readings per request`,
    ),
});
export type CreateReadingsInput = z.infer<typeof createReadingsSchema>;

// Both bounds are inclusive; an omitted bound leaves that side open.
const rangeShape = {
  from: timestampSchema.optional(),
  to: timestampSchema.optional(),
};

const orderedRange = (value: { from?: string; to?: string }) =>
  !value.from || !value.to || Date.parse(value.from) <= Date.parse(value.to);

const ORDERED_RANGE_ERROR = {
  message: "from must not be after to",
  path: ["from"],
};

/**
 * Range filter for reading and deleting.
 *
 * `metric` is optional here: a chart needs every quantity the point recorded,
 * and a deletion may legitimately target all of them.
 */
export const readingsRangeQuerySchema = z
  .object({ ...rangeShape, metric: measurementMetricSchema.optional() })
  .refine(orderedRange, ORDERED_RANGE_ERROR);
export type ReadingsRangeQuery = z.infer<typeof readingsRangeQuerySchema>;

/**
 * Range filter for the aggregate, where `metric` is **required**.
 *
 * Averaging a temperature together with a vibration amplitude yields a number
 * that describes nothing, so the quantity cannot be left open.
 */
export const readingsMetricsQuerySchema = z
  .object({ ...rangeShape, metric: measurementMetricSchema })
  .refine(orderedRange, ORDERED_RANGE_ERROR);
export type ReadingsMetricsQuery = z.infer<typeof readingsMetricsQuerySchema>;

export interface InsertReadingsResult {
  received: number;
  inserted: number;
}

export interface DeleteReadingsResult {
  deleted: number;
}

export interface ReadingsMetrics {
  /** The quantity these aggregates describe, echoed back so a caller can label them. */
  metric: MeasurementMetric;
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  firstTimestamp: string | null;
  lastTimestamp: string | null;
}

export interface TimeSeriesCount {
  count: number;
}
