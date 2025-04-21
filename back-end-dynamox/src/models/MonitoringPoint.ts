import mongoose from 'mongoose';
import { VALID_SENSOR_MODELS } from '../utils/constants';

const monitoringPointSchema = new mongoose.Schema({
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sensor: {
    model: { type: String, required: true, enum: ['TcAg', 'TcAs', 'HF+'] },
    serialNumber: { type: String, required: true, unique: true },
  }
});

export const MonitoringPoint = mongoose.model('MonitoringPoint', monitoringPointSchema);
