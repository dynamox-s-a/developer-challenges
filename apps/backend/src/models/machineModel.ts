import mongoose, { Schema, Document } from "mongoose";

export interface IMachine extends Document {
  name: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const machineSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // Adicionado campo "type"
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const MachineModel = mongoose.model<IMachine>("Machine", machineSchema);

export default MachineModel;
