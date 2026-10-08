import { MachineType, SensorModel } from './enums';

// TcAg and TcAs sensors cannot be used on pumps. Fans accept every model.
const DISALLOWED_SENSOR_MODELS: Record<MachineType, readonly SensorModel[]> = {
  [MachineType.Pump]: [SensorModel.TcAg, SensorModel.TcAs],
  [MachineType.Fan]: [],
};

/**
 * The machine × sensor business rule, shared so the API (authoritative) and
 * the web app (UX only) can never disagree.
 */
export function isSensorCompatibleWithMachine(
  machineType: MachineType,
  sensorModel: SensorModel,
): boolean {
  return !DISALLOWED_SENSOR_MODELS[machineType].includes(sensorModel);
}

export function disallowedSensorModels(
  machineType: MachineType,
): readonly SensorModel[] {
  return DISALLOWED_SENSOR_MODELS[machineType];
}
