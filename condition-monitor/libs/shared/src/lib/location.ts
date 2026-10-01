import type { MachineType } from './machine.js';

/**
 * Installation positions per machine type (assumption B11). Bearings are numbered along
 * the power flow, from the motor's free end to the driven equipment, which is also the
 * order the interface lists them in.
 */
export const PUMP_LOCATIONS = [
  { code: 'PUMP_MOTOR_NDE', label: 'Motor, non-drive end bearing' },
  { code: 'PUMP_MOTOR_DE', label: 'Motor, drive end bearing' },
  { code: 'PUMP_COUPLING_SIDE', label: 'Pump, coupling side bearing' },
  { code: 'PUMP_IMPELLER_SIDE', label: 'Pump, impeller side bearing' },
  { code: 'PUMP_MECHANICAL_SEAL', label: 'Pump, mechanical seal' },
] as const;

/** Fans use "drive end" rather than "coupling side" because they are often belt driven. */
export const FAN_LOCATIONS = [
  { code: 'FAN_MOTOR_NDE', label: 'Motor, non-drive end bearing' },
  { code: 'FAN_MOTOR_DE', label: 'Motor, drive end bearing' },
  { code: 'FAN_SHAFT_DE', label: 'Fan shaft, drive end bearing' },
  { code: 'FAN_SHAFT_NDE', label: 'Fan shaft, non-drive end bearing' },
] as const;

/** Any other spot, described by the monitoring point name. Valid for both types. */
export const OTHER_LOCATION = { code: 'OTHER', label: 'Other location' } as const;

export type PumpLocation = (typeof PUMP_LOCATIONS)[number]['code'];
export type FanLocation = (typeof FAN_LOCATIONS)[number]['code'];
export type Location = PumpLocation | FanLocation | typeof OTHER_LOCATION.code;

export interface LocationOption {
  code: Location;
  label: string;
}

const LOCATIONS_BY_TYPE: Record<MachineType, readonly LocationOption[]> = {
  Pump: [...PUMP_LOCATIONS, OTHER_LOCATION],
  Fan: [...FAN_LOCATIONS, OTHER_LOCATION],
};

const ALL_LOCATIONS: readonly LocationOption[] = [
  ...PUMP_LOCATIONS,
  ...FAN_LOCATIONS,
  OTHER_LOCATION,
];

export function isLocation(value: unknown): value is Location {
  return ALL_LOCATIONS.some((location) => location.code === value);
}

/** The positions offered for a machine type, in power-flow order, `OTHER` last. */
export function locationsFor(type: MachineType): readonly LocationOption[] {
  return LOCATIONS_BY_TYPE[type];
}

export function isLocationAllowed(type: MachineType, location: Location): boolean {
  return LOCATIONS_BY_TYPE[type].some((option) => option.code === location);
}

/** `OTHER` is the only position that may repeat on the same machine. */
export function isRepeatableLocation(location: Location): boolean {
  return location === OTHER_LOCATION.code;
}

export function locationLabel(location: Location): string {
  const option = ALL_LOCATIONS.find((candidate) => candidate.code === location);
  if (!option) {
    throw new Error(`Unknown location: ${location}`);
  }
  return option.label;
}
