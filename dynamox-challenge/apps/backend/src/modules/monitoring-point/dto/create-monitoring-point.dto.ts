import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class CreateMonitoringPointDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  machineId: number;
}