import type { MachineType, SensorModel } from "@dyn/contracts";
import { sensorModelSchema } from "@dyn/contracts";

// Machine/sensor compatibility is enforced from both sides: machines reject a type change that
// would orphan attached sensors, and monitoring points reject an incompatible sensor. Both slices
// read the rule from here so the two checks can never drift apart.
export const pumpSensorModel: SensorModel = "HF+";

export function incompatibleSensorModels(type: MachineType): SensorModel[] {
  return type === "Pump"
    ? sensorModelSchema.options.filter((model) => model !== pumpSensorModel)
    : [];
}

export function incompatibleMachineTypes(model: SensorModel): MachineType[] {
  return model === pumpSensorModel ? [] : ["Pump"];
}
