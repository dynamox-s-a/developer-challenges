import {
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'

import { Machine } from '../entity/machine.entity'

export class CreateMachineDto extends Machine {
    @IsNumber()
    user_id: number

    @IsOptional()
    machine_name: string

    @IsOptional()
    machine_type: string

}
