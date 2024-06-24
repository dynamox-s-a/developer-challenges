import {
    IsNumber,
    IsString,
} from 'class-validator'

import { Machine } from '../entity/machine.entity'

export class CreateMachineDto extends Machine {
    @IsNumber()
    user_id: number

    @IsString()
    machine_name: string

    @IsString()
    machine_type: string

}
