import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Pump', 'Fan'], required: true },
});

export const Machine = mongoose.model('Machine', machineSchema);
