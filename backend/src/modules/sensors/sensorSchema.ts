import { Schema, model } from "mongoose";
import { ISensor } from "./ISensor";

const sensorSchema = new Schema<ISensor>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    enum: ["TcAg", "TcAs", "HF+"],
  },
  machine: String,
});

const SENSOR = model("Sensor", sensorSchema);
export default SENSOR;
