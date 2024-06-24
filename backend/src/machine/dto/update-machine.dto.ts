import { CreateMachineDto } from './create-machine.dto';
import { PartialType } from '@nestjs/mapped-types'

export class UpdateMachineDto extends PartialType(CreateMachineDto) {}
