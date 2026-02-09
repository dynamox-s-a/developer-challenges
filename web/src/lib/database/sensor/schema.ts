import mongoose from 'mongoose'
import z from 'zod'

enum SensorTypes {
  Pump = 'pump',
  Fan = 'fan',
}

const SensorModel = z.object({
  Name: z.string().max(30),
  Type: z.enum(SensorTypes),
})

export interface ISensor extends mongoose.Document {
  Name: string
  Type: SensorTypes
  createdAt: Date
  updatedAt: Date
}

const SensorSchema = new mongoose.Schema<ISensor>(
  {
    Name: { type: String, required: true },
    Type: { type: String, required: true, enum: Object.values(SensorTypes) },
  },
  { timestamps: true },
)

export type SensorDTO = z.infer<typeof SensorModel>
export type SensorDocument = mongoose.HydratedDocument<ISensor>

const Machine =
  mongoose.models.Sensor || mongoose.model<ISensor>('Machine', SensorSchema)

export default Machine
