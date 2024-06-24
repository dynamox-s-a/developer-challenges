import { CreateSensorDto } from './create-sensor.dto';
import { PartialType } from '@nestjs/mapped-types'

export class UpdateSensorDto extends PartialType(CreateSensorDto) {}
