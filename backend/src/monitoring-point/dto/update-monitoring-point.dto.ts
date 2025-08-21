import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateMonitoringPointDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  machineId?: number;
}
