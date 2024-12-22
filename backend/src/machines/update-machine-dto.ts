import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateMachineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['Pump', 'Fan'])
  type?: string;
}
