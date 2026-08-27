import { MachineType, SensorModel as PrismaSensorModel } from '@prisma/client';
import {
  MachineType as SharedMachineType,
  SensorModel as SharedSensorModel,
  isSensorAllowedForMachine,
} from '@dynamox/shared';

export const toPrismaSensorModel: Record<SharedSensorModel, PrismaSensorModel> = {
  [SharedSensorModel.TcAg]: PrismaSensorModel.TcAg,
  [SharedSensorModel.TcAs]: PrismaSensorModel.TcAs,
  [SharedSensorModel.HFPlus]: PrismaSensorModel.HFPlus,
};

export const toSharedSensorModel: Record<PrismaSensorModel, SharedSensorModel> = {
  [PrismaSensorModel.TcAg]: SharedSensorModel.TcAg,
  [PrismaSensorModel.TcAs]: SharedSensorModel.TcAs,
  [PrismaSensorModel.HFPlus]: SharedSensorModel.HFPlus,
};

export function toSharedMachineType(type: MachineType): SharedMachineType {
  return type as SharedMachineType;
}

export function assertSensorAllowedForMachine(
  machineType: MachineType,
  sensorModel: SharedSensorModel
): boolean {
  return isSensorAllowedForMachine(toSharedMachineType(machineType), sensorModel);
}
