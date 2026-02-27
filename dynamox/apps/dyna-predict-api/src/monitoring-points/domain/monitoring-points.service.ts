/**
 * @fileoverview Monitoring Points domain service. Contains business logic for
 * sensor validation rules, keeping them decoupled from HTTP transport concerns.
 */

import type { MachineType, SensorModel } from '@dynamox/types';

/**
 * Returns true if the given sensor model is not allowed for the given machine type.
 * Business rule: Pump machines only accept HFPlus sensors.
 */
export function isSensorForbiddenForMachine(
  machineType: MachineType,
  sensorModel: SensorModel,
): boolean {
  return machineType === 'Pump' && sensorModel !== 'HFPlus';
}
