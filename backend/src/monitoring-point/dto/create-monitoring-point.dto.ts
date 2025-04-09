import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateMonitoringPointDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  machineId: number;
}
