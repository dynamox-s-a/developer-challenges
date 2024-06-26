
import {
    IsNumber,
    IsString,
} from 'class-validator'

import { Monitors } from '../entity/monitor.entity'

export class CreateMonitorsDto extends Monitors {
    
    @IsNumber()
    machine_id: number
    
    @IsString()
    monitoring_point_name: string 

}
