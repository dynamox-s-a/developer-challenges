import { MachineType } from '@prisma/client';

export class CreateMachineDto {
  name: string;
  type: MachineType;
}
