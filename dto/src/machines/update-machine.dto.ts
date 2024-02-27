import { createMachineDto } from './create-machine.dto';

export type UpdateMachineDto = {
  name?: string;
  type?: string;
};

export const updateMachineDto = createMachineDto.partial();
