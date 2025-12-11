import { IsString, IsNotEmpty, IsEnum, IsUUID, IsOptional } from 'class-validator';

export enum SensorModel {
  TcAg = 'TcAg',
  TcAs = 'TcAs',
  HF_PLUS = 'HF+',
}

export class CreatePointDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SensorModel, {
    message: 'sensorModel must be either TcAg, TcAs, or HF+',
  })
  @IsNotEmpty()
  sensorModel: string;

  @IsUUID()
  @IsNotEmpty()
  machineId: string;

  @IsOptional()
  @IsString()
  status?: string;
}