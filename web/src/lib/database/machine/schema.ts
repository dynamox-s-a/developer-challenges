import { MachineTypeSchema, type MachineType } from '@/types/zod/machine'
import mongoose from 'mongoose'

const valuesMachineType = MachineTypeSchema.options as string[]

export interface IMachine extends mongoose.Document {
  Name: string
  Type: MachineType
  createdAt: Date
  updatedAt: Date
}

const MachineSchema = new mongoose.Schema<IMachine>(
  {
    Name: { type: String, required: true },
    Type: { type: String, required: true, enum: valuesMachineType },
  },
  { timestamps: true },
)

export type MachineDocument = mongoose.HydratedDocument<IMachine>

const Machine =
  mongoose.models.Machine || mongoose.model<IMachine>('Machine', MachineSchema)

export default Machine
