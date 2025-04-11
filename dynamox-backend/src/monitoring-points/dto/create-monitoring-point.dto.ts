import { IsEnum, IsString, IsUUID } from 'class-validator';

export enum SensorModel {
  TcAg = 'TcAg',
  TcAs = 'TcAs',
  HF_Plus = 'HF_Plus',
}

export class CreateMonitoringPointDto {
  @IsString()
  name: string;

  @IsUUID()
  machineId: string;

  @IsEnum(SensorModel)
  sensorModel: SensorModel;
}
