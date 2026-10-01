import {
  AXES,
  QUANTITY_CODES,
  QUANTITIES,
  type Axis,
  type MachineType,
  type Quantity,
  type Reading,
} from '@condition-monitor/shared';
import { valueAt } from './signal';

/** The series a sensor produces: vibration on three axes, and temperature (C10, C13). */
export const SERIES = QUANTITY_CODES.flatMap<{ quantity: Quantity; axis: Axis | null }>(
  (quantity) =>
    QUANTITIES[quantity].requiresAxis
      ? AXES.map((axis) => ({ quantity, axis }))
      : [{ quantity, axis: null }],
);

export interface SimulatedSensor {
  serialNumber: string;
  machineType: MachineType;
}

/** Every series of a sensor at each instant, in time order. */
export function sensorReadings(
  sensor: SimulatedSensor,
  times: number[],
  seed: number,
  degradingSince: number | null = null,
): Reading[] {
  return times.flatMap((timestamp) =>
    SERIES.map(({ quantity, axis }) => ({
      serialNumber: sensor.serialNumber,
      timestamp: new Date(timestamp).toISOString(),
      quantity,
      axis,
      value: valueAt({ seed, ...sensor, quantity, axis, timestamp, degradingSince }),
    })),
  );
}
