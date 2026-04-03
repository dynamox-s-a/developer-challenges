import { z } from "zod";

const PointSchema = z.object({
  timestamp: z.iso
    .datetime({ message: "timestamp must be ISO 8601 format" })
    .pipe(z.coerce.date()),
  value: z.number(),
});

export const createTimeSeriesSchema = z.object({
  seriesId: z.string().trim().min(1, "seriesId is required"),
  unit: z.string().trim().min(1, "unit is required"),
  points: z.array(PointSchema).min(1, "points must be a non-empty array"),
});

export type CreateTimeSeriesDto = z.infer<typeof createTimeSeriesSchema>;
