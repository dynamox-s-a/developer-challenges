import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMonitoringPointDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  machineId: number;
}
