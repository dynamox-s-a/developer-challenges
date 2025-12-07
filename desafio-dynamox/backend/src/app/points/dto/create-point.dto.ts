import { ApiProperty } from '@nestjs/swagger';

class CreateSensorDto {
  @ApiProperty({ example: 'S-100', description: 'ID manual do sensor' })
  id: string;

  @ApiProperty({ example: 'HF+', enum: ['TcAg', 'TcAs', 'HF+'], description: 'Modelo do sensor' })
  model: string;
}

export class CreatePointDto {
  @ApiProperty({ example: 'Ponto Motor Traseiro', description: 'Nome do ponto' })
  name: string;

  @ApiProperty({ example: 'COLE_O_UUID_DA_MAQUINA_AQUI', description: 'ID da máquina dona deste ponto' })
  machineId: string;

  @ApiProperty({ required: false, type: CreateSensorDto, description: 'Dados do sensor (Opcional)' })
  sensor?: CreateSensorDto;
}