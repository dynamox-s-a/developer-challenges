import { z } from "zod";
import { TimeSeries } from "../models/TimeSeries.js";

const seriesIdSchema = z.string().trim().min(1, "seriesId is required");

const PointSchema = z.object({
  timestamp: z.iso
    .datetime({ message: "timestamp must be ISO 8601 format" })
    .pipe(z.coerce.date()),
  value: z.number(),
});

export const createTimeSeriesSchema = z.object({
  seriesId: seriesIdSchema,
  unit: z.string().trim().min(1, "unit is required"),
  points: z.array(PointSchema).min(1, "points must be a non-empty array"),
});

export const getBySeriesIdSchema = z.object({
  seriesId: seriesIdSchema,
});

export const deleteTimeSeriesSchema = z.object({
  seriesId: seriesIdSchema,
});

export type CreateTimeSeriesDto = z.infer<typeof createTimeSeriesSchema>;

export const toTimeSeriesResponse = (series: TimeSeries) => {
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

export const toCountResponse = (total: Number) => {
  return {
    total_series: Number(total),
  };
};
