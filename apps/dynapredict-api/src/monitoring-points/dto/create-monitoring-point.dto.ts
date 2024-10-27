import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMonitoringPointDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
