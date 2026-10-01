import type { MachineType } from './machine.js';

/** Sensor models accepted by the challenge. */
export const SENSOR_MODELS = ['TcAg', 'TcAs', 'HF+'] as const;

export type SensorModel = (typeof SENSOR_MODELS)[number];

/**
 * Models allowed per machine type. The challenge forbids TcAg and TcAs on pumps, so a
 * pump accepts only the 13 kHz HF+ (assumption B15).
 */
const ALLOWED_MODELS: Record<MachineType, readonly SensorModel[]> = {
  Pump: ['HF+'],
  Fan: SENSOR_MODELS,
};

export function isSensorModel(value: unknown): value is SensorModel {
  return SENSOR_MODELS.includes(value as SensorModel);
}

export function allowedSensorModels(type: MachineType): readonly SensorModel[] {
  return ALLOWED_MODELS[type];
}

export function isSensorModelAllowed(type: MachineType, model: SensorModel): boolean {
  return ALLOWED_MODELS[type].includes(model);
}
