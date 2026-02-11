import mongoose from 'mongoose'

export interface IMonitoringPoint extends mongoose.Document {
  Name: string
  Sensor?: mongoose.Types.ObjectId
  Machine: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const MonitoringPointSchema = new mongoose.Schema<IMonitoringPoint>(
  {
    Name: { type: String, required: true },
    Sensor: {
      type: mongoose.Types.ObjectId,
      ref: 'Sensor',
      index: true,
      required: false,
    },
    Machine: {
      type: mongoose.Types.ObjectId,
      ref: 'Machine',
      index: true,
      required: true,
    },
  },
  { timestamps: true },
)

export type MonitoringPointDocument =
  mongoose.HydratedDocument<IMonitoringPoint>

const MonitoringPoint =
  mongoose.models.MonitoringPoint ||
  mongoose.model<IMonitoringPoint>('MonitoringPoint', MonitoringPointSchema)

export default MonitoringPoint
