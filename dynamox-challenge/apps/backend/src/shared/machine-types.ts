export const MACHINE_TYPES = {
  PUMP: 'Bomba',
  FAN: 'Fã',
} as const;


export type MachineType = (typeof MACHINE_TYPES)[keyof typeof MACHINE_TYPES];

export const MACHINE_TYPE_VALUES = Object.values(MACHINE_TYPES);
