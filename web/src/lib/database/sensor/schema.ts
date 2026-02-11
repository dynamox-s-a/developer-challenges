import mongoose from 'mongoose'
import { SensorTypeSchema, type SensorType } from '../../../types/zod/sensor'

const sensorTypeValues = SensorTypeSchema.options as string[]

export interface ISensor extends mongoose.Document {
  Model: SensorType
  Machine: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SensorSchema = new mongoose.Schema<ISensor>(
  {
    Model: { type: String, required: true, enum: sensorTypeValues },
    Machine: {
      type: mongoose.Types.ObjectId,
      ref: 'Machine',
      index: true,
      required: true,
    },
  },
  { timestamps: true },
)

export type SensorDocument = mongoose.HydratedDocument<ISensor>
const Sensor =
  mongoose.models.Sensor || mongoose.model<ISensor>('Sensor', SensorSchema)
export default Sensor
