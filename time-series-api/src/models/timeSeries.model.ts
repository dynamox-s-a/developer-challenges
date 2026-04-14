import { Schema, model } from 'mongoose';
import { Sample, TimeSeries } from '../types/timeSeries';

const sampleSchema = new Schema<Sample>(
  {
    timestamp: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const timeSeriesSchema = new Schema<TimeSeries>(
  {
    name: {
      type: String,
      trim: true,
      required: false,
      maxlength: 100,
    },
    samples: {
      type: [sampleSchema],
      required: true,
      validate: {
        validator: (samples: Sample[]) => Array.isArray(samples) && samples.length > 0,
        message: 'samples must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TimeSeriesModel = model<TimeSeries>('TimeSeries', timeSeriesSchema);