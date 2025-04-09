import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { SensorModel } from '@prisma/client';

export class CreateSensorDto {
  @IsEnum(SensorModel)
  @IsNotEmpty()
  model: SensorModel;

  @IsInt()
  @IsNotEmpty()
  monitoringPointId: number;
}
