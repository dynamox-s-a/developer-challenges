import { z } from 'zod';
import { AXES, isAxisValidFor, QUANTITY_CODES, type Axis, type Quantity } from './quantity.js';
import { serialNumberSchema } from './point-schemas.js';

/**
 * Readings accepted in one submission, JSON or CSV (assumption C8). The number comes from
 * the load test: storing a submission of this size stays within the 350 ms latency
 * limit with room to spare, one of 3,000 barely does and one of 5,000 does not
 * (docs/performance.md).
 */
export const MAX_READINGS_PER_SUBMISSION = 2_000;

/** Size of a CSV upload; the API answers 413 above it, the interface checks it first. */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** Readings a single series may hold, about one year at a 10-minute interval (C8). */
export const MAX_READINGS_PER_SERIES = 50_000;

/**
 * An instant in ISO 8601 with an explicit offset, such as `2026-09-29T10:00:00Z` or
 * `2026-09-29T07:00:00-03:00` (C12). A time without an offset is ambiguous and refused.
 * Precision stops at milliseconds, which is what JavaScript dates and the database keep:
 * two readings a microsecond apart would otherwise collapse into one without notice.
 * The result is the same instant in UTC, so equal instants compare equal as text.
 */
export const readingTimestampSchema = z
  .string({ error: 'Required.' })
  .trim()
  .pipe(
    z.iso.datetime({
      offset: true,
      error: 'Must be ISO 8601 with an offset, such as 2026-09-29T10:00:00Z.',
    }),
  )
  .refine((value) => !/\.\d{4,}/.test(value), 'At most millisecond precision.')
  .transform((value) => new Date(value).toISOString());

export const quantitySchema = z.enum(QUANTITY_CODES as [Quantity, ...Quantity[]], {
  error: `Must be one of: ${QUANTITY_CODES.join(', ')}.`,
});

export const axisSchema = z.enum(AXES, { error: `Must be one of: ${AXES.join(', ')}, or null.` });

/** A number that is a measurement: JSON cannot carry NaN or infinity, and Zod refuses them. */
export const readingValueSchema = z.number({ error: 'Must be a number.' });

/**
 * One reading as sent by the simulator. `axis` is `null` for temperature and required
 * for vibration (C10): an empty axis means "no direction", never "unknown".
 */
export const readingSchema = z
  .object({
    serialNumber: serialNumberSchema,
    timestamp: readingTimestampSchema,
    quantity: quantitySchema,
    axis: axisSchema.nullable(),
    value: readingValueSchema,
  })
  .superRefine((reading, context) => {
    if (!isAxisValidFor(reading.quantity, reading.axis)) {
      context.addIssue({
        code: 'custom',
        path: ['axis'],
        message:
          reading.axis === null
            ? `${reading.quantity} needs an axis: ${AXES.join(', ')}.`
            : `${reading.quantity} has no axis; send null.`,
      });
    }
  });

/** Body of `POST /api/readings`. */
export const ingestReadingsSchema = z.object({
  readings: z
    .array(readingSchema, { error: 'Must be a list of readings.' })
    .min(1, 'Send at least one reading.')
    .max(
      MAX_READINGS_PER_SUBMISSION,
      `At most ${MAX_READINGS_PER_SUBMISSION.toLocaleString('en-US')} readings per submission.`,
    ),
});

export type ReadingInput = z.infer<typeof readingSchema>;

/** A reading after validation: the timestamp is ISO 8601 in UTC, with milliseconds. */
export interface Reading {
  serialNumber: string;
  timestamp: string;
  quantity: Quantity;
  axis: Axis | null;
  value: number;
}

/** What one submission did for one sensor (C11). */
export interface SensorIngestion {
  serialNumber: string;
  monitoringPointId: string;
  seriesCreated: number;
  readingsInserted: number;
  /** Sent again with the value already stored, and ignored (C5). */
  readingsRepeated: number;
}

export interface IngestionReport {
  sensors: SensorIngestion[];
  totals: { seriesCreated: number; readingsInserted: number; readingsRepeated: number };
}
