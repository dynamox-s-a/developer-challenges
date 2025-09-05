export interface MachineType {
  id: number;
  name: string;
}

export interface Machine {
  id: string;
  name: string;
  serialNumber: string;
  description?: string;
  machineTypeId: number;
  machineType?: MachineType;
}
