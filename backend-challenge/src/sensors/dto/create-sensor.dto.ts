import { SensorModel } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDto {
  @IsNotEmpty({
    message: 'The sensor model is required'
  })
  @IsEnum(SensorModel, {message: 'Invalid sensor model'})
  @ApiProperty({ example: 'TcAg', description: 'The model of the sensor' })
  model: SensorModel;
}
