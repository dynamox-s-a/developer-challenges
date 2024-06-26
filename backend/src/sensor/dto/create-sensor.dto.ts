import { Sensor } from './../entity/sensor.entity';
import {
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'


export class CreateSensorDto extends Sensor {

    @IsNumber()
    machine_id: number

    @IsNumber()
    monitoring_point_id: number

    @IsString()
    sensor_type: string

}
