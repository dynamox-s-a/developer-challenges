import { MachineType } from 'src/entities/machine.entity';

export type CreateMachineDto = {
  name: string;
  type: MachineType;
};

export type UpdateMachineDto = {
  name: string;
  type: MachineType;
};
