import { z } from 'zod';
import type { MachineType } from './machine.schema.ts';

export const sensorModelSchema = z.enum(
  ['TcAg', 'TcAs', 'HF+'],
  'Modelo de sensor inválido',
);
export type SensorModel = z.infer<typeof sensorModelSchema>;
export const SENSOR_MODELS = sensorModelSchema.options; // ['TcAg', 'TcAs', 'HF+']

// Regra do negócio: TcAg e TcAs não podem ser usados em máquinas do tipo Pump
const MODELS_NOT_ALLOWED_ON_PUMP: SensorModel[] = ['TcAg', 'TcAs'];

export function isSensorModelAllowed(
  machineType: MachineType,
  sensorModel: SensorModel,
): boolean {
  if (machineType === 'Pump') {
    return !MODELS_NOT_ALLOWED_ON_PUMP.includes(sensorModel);
  }
  return true;
}