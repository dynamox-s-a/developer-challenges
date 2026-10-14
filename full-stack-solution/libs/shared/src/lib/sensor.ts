import { z } from "zod";
import type { MachineType } from "./machine";

export const SENSOR_MODELS = ["TcAg", "TcAs", "HF+"] as const;
export const sensorModelSchema = z.enum(SENSOR_MODELS);
export type SensorModel = z.infer<typeof sensorModelSchema>;

export const assignSensorSchema = z.object({
  id: z.string().trim().min(2, "Sensor ID is required").max(50),
  model: sensorModelSchema,
});

export type AssignSensorInput = z.infer<typeof assignSensorSchema>;

const MODELS_BLOCKED_FOR_PUMP: readonly SensorModel[] = ["TcAg", "TcAs"];

export function isSensorModelAllowed(
  machineType: MachineType,
  sensorModel: SensorModel,
): boolean {
  if (machineType === "Pump") {
    return !MODELS_BLOCKED_FOR_PUMP.includes(sensorModel);
  }
  return true;
}

export function getAllowedSensorModels(
  machineType: MachineType,
): SensorModel[] {
  return SENSOR_MODELS.filter((model) =>
    isSensorModelAllowed(machineType, model),
  );
}

export function getBlockedSensorModels(
  machineType: MachineType,
): SensorModel[] {
  return SENSOR_MODELS.filter(
    (model) => !isSensorModelAllowed(machineType, model),
  );
}

export function sensorNotAllowedMessage(
  machineType: MachineType,
  sensorModel: SensorModel,
): string {
  return `Sensor model ${sensorModel} cannot be used on ${machineType} machines`;
}

export interface Sensor {
  id: string;
  model: SensorModel;
  monitoringPointId: string;
}
