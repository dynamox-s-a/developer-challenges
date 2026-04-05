import { z } from "zod";
import { TimeSeries } from "../models/time-series.model.js";
import { TimeSeriesMetrics } from "../models/time-series.types.js";

const MAX_POINTS_PER_SERIES = 2000;
const seriesIdSchema = z.string().trim().min(1, "series_id is required");

const PointSchema = z.object({
  timestamp: z.iso
    .datetime({ message: "timestamp must be ISO 8601 format" })
    .pipe(z.coerce.date()),
  value: z.number(),
});

export const createTimeSeriesSchema = z
  .object({
    series_id: seriesIdSchema,
    unit: z.string().trim().min(1, "unit is required"),
    points: z
      .array(PointSchema)
      .min(1, "points must be a non-empty array")
      .max(
        MAX_POINTS_PER_SERIES,
        `points must contain at most ${MAX_POINTS_PER_SERIES} items`,
      ),
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>();

    data.points.forEach((point, index) => {
      const key = point.timestamp.toISOString();

      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: ["points", index, "timestamp"],
          message: "timestamp must be unique within the same series",
        });
      }

      seen.add(key);
    });
  });

export const getBySeriesIdSchema = z.object({
  series_id: seriesIdSchema,
});

export const deleteTimeSeriesSchema = z.object({
  series_id: seriesIdSchema,
});

export type CreateTimeSeriesDto = z.infer<typeof createTimeSeriesSchema>;

export type PointResponse = {
  timestamp: string;
  value: number;
};

export type TimeSeriesCreationResponse = {
  series_id: string;
  created_at: string;
};

export type TimeSeriesResponse = {
  series_id: string;
  unit: string;
  points: PointResponse[];
  created_at: string;
};

export type CountResponse = {
  total_series: number;
};

export type TimeSeriesMetricsResponse = {
  series_id: string;
  unit: string;
  total_points: number;
  min_value: number;
  max_value: number;
  average_value: number;
  first_timestamp: string;
  last_timestamp: string;
};

export const toTimeSeriesCreationResponse = (
  series: TimeSeries,
): TimeSeriesCreationResponse => {
  return {
    series_id: series.seriesId,
    created_at: series.createdAt.toISOString(),
  };
};

export const toTimeSeriesResponse = (
  series: TimeSeries,
): TimeSeriesResponse => {
  return {
    series_id: series.seriesId,
    unit: series.unit,
    points: series.points.map((point) => ({
      timestamp: point.timestamp.toISOString(),
      value: point.value,
    })),
    created_at: series.createdAt.toISOString(),
  };
};

export const toCountResponse = (total: number): CountResponse => {
  return {
    total_series: total,
  };
};

export const toTimeSeriesMetricsResponse = (
  metrics: TimeSeriesMetrics,
): TimeSeriesMetricsResponse => {
  return {
    series_id: metrics.seriesId,
    unit: metrics.unit,
    total_points: metrics.totalPoints,
    min_value: metrics.minValue,
    max_value: metrics.maxValue,
    average_value: metrics.averageValue,
    first_timestamp: metrics.firstTimestamp.toISOString(),
    last_timestamp: metrics.lastTimestamp.toISOString(),
  };
};
