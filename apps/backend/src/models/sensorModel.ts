import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface ISensor extends Document {
  name: string;
  status: string;
  uniqueId: string;
  monitoring: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sensorSchema = new Schema<ISensor>(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    uniqueId: { type: String, default: uuidv4, unique: true },
    monitoring: { type: Schema.Types.ObjectId, ref: 'Monitoring', required: true },
  },
  { timestamps: true }
);

const Sensor = mongoose.model<ISensor>('Sensor', sensorSchema);

export default Sensor;
