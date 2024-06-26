
import {
    IsNumber,
    IsString,
} from 'class-validator'

import { Monitors } from '../entity/monitor.entity'

export class CreateMonitorsDto extends Monitors {
    @IsNumber()
    monitoring_point_id: number   
    
    @IsNumber()
    machine_id: number
    
    @IsString()
    monitoring_point_name: string 

}
