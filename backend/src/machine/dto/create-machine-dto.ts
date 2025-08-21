import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { MachineType } from '@prisma/client';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(MachineType)
  @IsNotEmpty()
  type: MachineType;
}
