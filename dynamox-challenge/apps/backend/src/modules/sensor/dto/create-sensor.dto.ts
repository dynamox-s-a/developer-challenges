import { IsNotEmpty, IsString, IsInt, IsEnum } from "class-validator";

export enum SensorModel {
  TcAg = 'TcAg',
  TcAs = 'TcAs',
  HF_PLUS = 'HF_PLUS',
}

export class CreateSensorDto {
  @IsNotEmpty()
  @IsEnum(SensorModel, { message: 'Sensor model must be one of: TcAg, TcAs, HF_PLUS' })
  model: SensorModel;

  @IsNotEmpty()
  @IsInt()
  monitoringPointId: number;
}