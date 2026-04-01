import mongoose, { Schema, Document } from "mongoose";

export interface IPoint {
  timestamp: Date;
  value: number;
}

export interface ITimeSeries extends Document {
  seriesId: string;
  unit: string;
  points: IPoint[];
  createdAt: Date;
}

const PointSchema = new Schema<IPoint>(
  {
    timestamp: { type: Date, required: true },
    value: { type: Number, required: true },
  },
  { _id: false },
);

const TimeSeriesSchema = new Schema<ITimeSeries>(
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

export const TimeSeries = mongoose.model<ITimeSeries>(
  "TimeSeries",
  TimeSeriesSchema,
);
