import { IsNotEmpty, IsString, IsInt, IsOptional, IsEnum } from "class-validator";
import { SensorModel } from "../../sensor/dto/create-sensor.dto";

export class CreateMonitoringPointDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  machineId: number;

  @IsOptional()
  @IsEnum(SensorModel, { message: 'Sensor model must be one of: TcAg, TcAs, HF_PLUS' })
  sensorModel?: SensorModel;
}