import { InferSchemaType, model, Schema } from "mongoose";

const PointSchema = new Schema(
  {
    timestamp: { type: Date, required: true },
    value: { type: Number, required: true },
  },
  { _id: false },
);

const TimeSeriesSchema = new Schema(
  {
    seriesId: { type: String, required: true },
    unit: { type: String, required: true },
    points: { type: [PointSchema], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "time_series",
  },
);

TimeSeriesSchema.index({ seriesId: 1 }, { unique: true });
TimeSeriesSchema.index({ "points.timestamp": 1 });

export type TimeSeries = InferSchemaType<typeof TimeSeriesSchema>;

export const TimeSeriesModel = model("TimeSeries", TimeSeriesSchema);
