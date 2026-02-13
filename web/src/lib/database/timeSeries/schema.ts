import mongoose from 'mongoose'

export interface ITimeSeries extends mongoose.Document {
  monitoringPointId: mongoose.Types.ObjectId
  timestamp: Date
  value: number
  unit?: string
  createdAt: Date
  updatedAt: Date
}

const TimeSeriesSchema = new mongoose.Schema<ITimeSeries>(
  {
    monitoringPointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MonitoringPoint',
      required: true,
      index: true,
    },
    timestamp: { type: Date, required: true, index: -1 },
    value: { type: Number, required: true },
    unit: { type: String, default: null },
  },
  { timestamps: true },
)

TimeSeriesSchema.index({ monitoringPointId: 1, timestamp: -1 })

const TimeSeries =
  mongoose.models.TimeSeries ||
  mongoose.model<ITimeSeries>('TimeSeries', TimeSeriesSchema)

export default TimeSeries
