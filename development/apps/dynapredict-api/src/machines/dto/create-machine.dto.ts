import { MachineType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

const machineTypeValues = Object.values(MachineType).join(', ');

export class CreateMachineDTO {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(MachineType, {
    message: `Invalid machine type. Should be one of: ${machineTypeValues}`,
  })
  type: MachineType;
}
