export type MachineType = 'Pump' | 'Fan';

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
}