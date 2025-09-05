export interface MachineType {
  id: number;
  name: string;
}

export interface Machine {
  id: string;          // GUID vindo do backend
  name: string;
  serialNumber: string;
  description: string;
  machineType: MachineType;
}
