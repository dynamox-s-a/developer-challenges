/** Machine types accepted by the challenge. */
export const MACHINE_TYPES = ['Pump', 'Fan'] as const;

export type MachineType = (typeof MACHINE_TYPES)[number];

export function isMachineType(value: unknown): value is MachineType {
  return MACHINE_TYPES.includes(value as MachineType);
}
