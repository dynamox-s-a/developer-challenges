/**
 * Telemetry quantities, a closed list with a fixed unit each (assumption C10). With no
 * unit column anywhere, the same unit cannot arrive spelled in different ways.
 */
export const QUANTITIES = {
  acceleration_rms: { label: 'Acceleration RMS', unit: 'g', requiresAxis: true },
  velocity_rms: { label: 'Velocity RMS', unit: 'mm/s', requiresAxis: true },
  temperature: { label: 'Temperature', unit: '°C', requiresAxis: false },
} as const;

export type Quantity = keyof typeof QUANTITIES;

export const QUANTITY_CODES = Object.keys(QUANTITIES) as Quantity[];

/**
 * Machine directions, not sensor axes: with the standard mounting (assumption B13) the
 * sensor's X axis is axial, Y horizontal and Z vertical.
 */
export const AXES = ['H', 'V', 'A'] as const;

export type Axis = (typeof AXES)[number];

const AXIS_LABELS: Record<Axis, string> = {
  H: 'horizontal',
  V: 'vertical',
  A: 'axial',
};

export function isQuantity(value: unknown): value is Quantity {
  return QUANTITY_CODES.includes(value as Quantity);
}

export function isAxis(value: unknown): value is Axis {
  return AXES.includes(value as Axis);
}

export function unitOf(quantity: Quantity): string {
  return QUANTITIES[quantity].unit;
}

/**
 * Vibration needs a direction and temperature has none. `null` means "no direction",
 * never "unknown direction".
 */
export function isAxisValidFor(quantity: Quantity, axis: Axis | null): boolean {
  return QUANTITIES[quantity].requiresAxis ? axis !== null : axis === null;
}

/** Display name of a series, such as "Velocity RMS, horizontal". */
export function seriesLabel(quantity: Quantity, axis: Axis | null): string {
  const label = QUANTITIES[quantity].label;
  return axis === null ? label : `${label}, ${AXIS_LABELS[axis]}`;
}
