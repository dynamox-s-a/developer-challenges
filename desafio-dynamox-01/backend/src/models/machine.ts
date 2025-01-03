import { Schema, model } from 'mongoose';

const machineSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Bomba', 'Ventilador'], required: true },
});

const Machine = model('Machine', machineSchema);
export default Machine;
