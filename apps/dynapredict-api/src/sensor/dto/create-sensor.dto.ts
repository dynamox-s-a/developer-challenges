import { SensorModel } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

const sensorModelValues = Object.values(SensorModel).join(', ');

export class CreateSensorDto {
  @IsNotEmpty()
  @IsEnum(SensorModel, {
    message: `Invalid sensor model. Should be one of: ${sensorModelValues}`,
  })
  model: SensorModel;
}
