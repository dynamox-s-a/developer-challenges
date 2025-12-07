import { ApiProperty } from '@nestjs/swagger';

export class CreateMachineDto {
  @ApiProperty({ example: 'Bomba Principal 01', description: 'Nome da máquina' })
  name: string;

  @ApiProperty({ example: 'Bomba', enum: ['Bomba', 'Ventilador'], description: 'Tipo da máquina' })
  type: string;
}