import { PartialType } from "@nestjs/mapped-types";
import { CreateSensorDto, SensorModel } from "./create-sensor.dto";
import { IsInt, IsOptional, IsEnum } from "class-validator";

export class UpdateSensorDto extends PartialType(CreateSensorDto) {
  @IsOptional()
  @IsEnum(SensorModel, { message: 'Sensor model must be one of: TcAg, TcAs, HF_PLUS' })
  model?: SensorModel;

  @IsOptional()
  @IsInt()
  monitoringPointId?: number;
}