import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ErrorResponse, MachineResponse } from '../common/api-schemas';
import { parseCreateMachineDto, parseUpdateMachineDto } from './machines.dto';
import { MachinesService, type MachineDto } from './machines.service';

/**
 * Todas as rotas são privadas: sem @Public(), o guard JWT global do AUT-01 já exige
 * `Authorization: Bearer <token>` em cada uma delas.
 */
@ApiTags('machines')
@ApiBearerAuth('bearer')
@ApiResponse({ status: 401, description: 'Token ausente, inválido ou expirado', type: ErrorResponse })
@Controller('machines')
export class MachinesController {
  constructor(private readonly machines: MachinesService) {}

  @Post()
  @ApiResponse({
    status: 403,
    description: 'Perfil VIEWER: este endpoint altera estado e exige perfil administrador.',
    type: ErrorResponse,
  })
  @ApiOperation({ summary: 'Cria uma máquina (name + type em Pump/Fan)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'type'],
      additionalProperties: false,
      properties: {
        name: { type: 'string', maxLength: 120, example: 'P-101' },
        type: { type: 'string', enum: ['Pump', 'Fan'], example: 'Pump' },
      },
    },
    examples: {
      bomba: { summary: 'Bomba (recusa TcAg e TcAs)', value: { name: 'P-104', type: 'Pump' } },
      ventilador: { summary: 'Ventilador (aceita os três modelos)', value: { name: 'VE-204', type: 'Fan' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Máquina criada.', type: MachineResponse })
  @ApiResponse({
    status: 400,
    description: 'INVALID_MACHINE_PAYLOAD | INVALID_MACHINE_TYPE',
    type: ErrorResponse,
  })
  @ApiResponse({ status: 409, description: 'MACHINE_NAME_CONFLICT', type: ErrorResponse })
  create(@Body() body: unknown): Promise<MachineDto> {
    return this.machines.create(parseCreateMachineDto(body));
  }

  @Get()
  @ApiOperation({ summary: 'Lista as máquinas ordenadas por nome' })
  @ApiResponse({ status: 200, description: 'Máquinas cadastradas.', type: [MachineResponse] })
  list(): Promise<MachineDto[]> {
    return this.machines.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Uma máquina pelo id' })
  @ApiResponse({ status: 200, description: 'Máquina encontrada.', type: MachineResponse })
  @ApiResponse({ status: 404, description: 'MACHINE_NOT_FOUND', type: ErrorResponse })
  findOne(@Param('id') id: string): Promise<MachineDto> {
    return this.machines.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 403,
    description: 'Perfil VIEWER: este endpoint altera estado e exige perfil administrador.',
    type: ErrorResponse,
  })
  @ApiOperation({ summary: 'Altera name e/ou type; corpo vazio é 400' })
  @ApiBody({
    description: 'Envie apenas os campos que mudam.',
    schema: {
      type: 'object',
      minProperties: 1,
      additionalProperties: false,
      properties: {
        name: { type: 'string', maxLength: 120, example: 'P-101' },
        type: { type: 'string', enum: ['Pump', 'Fan'], example: 'Pump' },
      },
    },
    examples: {
      renomear: { summary: 'Só o nome', value: { name: 'P-101 — Bomba principal' } },
      trocarTipo: { summary: 'Só o tipo', value: { type: 'Fan' } },
      ambos: { summary: 'Nome e tipo', value: { name: 'VE-210', type: 'Fan' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Máquina alterada.', type: MachineResponse })
  @ApiResponse({ status: 400, description: 'INVALID_MACHINE_PAYLOAD', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'MACHINE_NOT_FOUND', type: ErrorResponse })
  @ApiResponse({
    status: 409,
    description:
      'MACHINE_NAME_CONFLICT | MACHINE_TYPE_SENSOR_CONFLICT — tornar a máquina Pump com um sensor TcAg/TcAs associado é revertido na transação.',
    type: ErrorResponse,
  })
  update(@Param('id') id: string, @Body() body: unknown): Promise<MachineDto> {
    return this.machines.update(id, parseUpdateMachineDto(body));
  }

  @Delete(':id')
  @ApiResponse({
    status: 403,
    description: 'Perfil VIEWER: este endpoint altera estado e exige perfil administrador.',
    type: ErrorResponse,
  })
  @ApiOperation({ summary: 'Remove a máquina; pontos de monitoramento caem em cascata' })
  @ApiResponse({ status: 204, description: 'Removida; resposta sem corpo.' })
  @ApiResponse({ status: 404, description: 'MACHINE_NOT_FOUND', type: ErrorResponse })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.machines.remove(id);
  }
}
