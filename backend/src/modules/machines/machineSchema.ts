import { Schema, model, Types } from "mongoose";
import { IMachine } from "./IMachine";

const machineSchema = new Schema<IMachine>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Pump", "Fan"],
  },
  monitoringPoint: [
    {
      name: String,
      sensor: {
        name: String,
        model: String,
        _id: Types.ObjectId,
      },
    },
  ],
});

const MACHINE = model("Machine", machineSchema);
export default MACHINE;
