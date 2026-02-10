import mongoose from 'mongoose'
import z from 'zod'

enum MachineTypes {
  Pump = 'Pump',
  Fan = 'Fan',
}

const MachineModel = z.object({
  Name: z.string().max(30),
  Type: z.enum(MachineTypes),
})

export interface IMachine extends mongoose.Document {
  Name: string
  Type: MachineTypes
  createdAt: Date
  updatedAt: Date
}

const MachineSchema = new mongoose.Schema<IMachine>(
  {
    Name: { type: String, required: true },
    Type: { type: String, required: true, enum: Object.values(MachineTypes) },
  },
  { timestamps: true },
)

export type MachineDTO = z.infer<typeof MachineModel>
export type MachineDocument = mongoose.HydratedDocument<IMachine>

const Machine =
  mongoose.models.Machine || mongoose.model<IMachine>('Machine', MachineSchema)

export default Machine
