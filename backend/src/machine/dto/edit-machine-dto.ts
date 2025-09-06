import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MachineType } from '@prisma/client';

export class UpdateMachineDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(MachineType)
  @IsOptional()
  type?: MachineType;
}
