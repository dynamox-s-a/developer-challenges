import { objectIdValidator } from '@/utils/types'
import mongoose from 'mongoose'
import z from 'zod'

enum SensorTypes {
  TCAG = 'TcAg',
  TCAS = 'TcAs',
  HF = 'HF+',
}

const SensorModel = z.object({
  Model: z.enum(SensorTypes),
  Machine: objectIdValidator,
})

export interface ISensor extends mongoose.Document {
  Model: SensorTypes
  Machine: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SensorSchema = new mongoose.Schema<ISensor>(
  {
    Model: { type: String, required: true, enum: Object.values(SensorTypes) },
    Machine: {
      type: mongoose.Types.ObjectId,
      ref: 'Machine',
      index: true,
      required: true,
    },
  },
  { timestamps: true },
)

export type SensorDTO = z.infer<typeof SensorModel>
export type SensorDocument = mongoose.HydratedDocument<ISensor>

const Sensor =
  mongoose.models.Sensor || mongoose.model<ISensor>('Sensor', SensorSchema)

export default Sensor
