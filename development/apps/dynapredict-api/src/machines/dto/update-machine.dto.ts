import { PartialType } from '@nestjs/mapped-types';
import { CreateMachineDTO } from './create-machine.dto';

export class UpdateMachineDto extends PartialType(CreateMachineDTO) {}
