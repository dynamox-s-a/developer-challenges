import { IsNotEmpty, IsString } from 'class-validator';
import type { MachineType } from '../../../shared/machine-types';

export class CreateMachineDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: MachineType;


}