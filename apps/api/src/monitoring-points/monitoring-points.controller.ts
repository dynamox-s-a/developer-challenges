import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MAX_PAGE } from './monitoring-points.dto';
import {
  ErrorResponse,
  MonitoringPointPageResponse,
  MonitoringPointResponse,
} from '../common/api-schemas';
import {
  parseAssignSensorDto,
  parseCreateMonitoringPointDto,
  parseListMonitoringPointsQuery,
} from './monitoring-points.dto';
import {
  MonitoringPointsService,
  type MonitoringPointDto,
  type MonitoringPointPageDto,
} from './monitoring-points.service';

/**
 * Todas as rotas são privadas: sem @Public(), o guard JWT global do AUT-01 já exige
 * `Authorization: Bearer <token>` em cada uma delas.
 */
@ApiTags('monitoring-points')
@ApiBearerAuth('bearer')
@ApiResponse({ status: 401, description: 'Token ausente, inválido ou expirado', type: ErrorResponse })
@Controller('monitoring-points')
export class MonitoringPointsController {
  constructor(private readonly monitoringPoints: MonitoringPointsService) {}

  @Post()
  @ApiResponse({
    status: 403,
    description: 'Perfil VIEWER: este endpoint altera estado e exige perfil administrador.',
    type: ErrorResponse,
  })
  @ApiOperation({ summary: 'Cria um ponto de monitoramento para uma máquina' })
  @ApiBody({
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['machineId', 'name'],
      properties: {
        machineId: { type: 'string', format: 'uuid', example: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10' },
        name: { type: 'string', maxLength: 120, example: 'Mancal lado acoplamento' },
      },
    },
    examples: {
      ladoAcoplamento: {
        summary: 'Mancal do lado do acoplamento (DE)',
        value: { machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10', name: 'Mancal lado acoplamento' },
      },
      ladoOposto: {
        summary: 'Mancal do lado oposto (NDE)',
        value: { machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10', name: 'Mancal lado oposto ao acoplamento' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ponto criado; nasce sem sensor (`sensor: null`).',
    type: MonitoringPointResponse,
  })
  @ApiResponse({ status: 400, description: 'INVALID_MONITORING_POINT_PAYLOAD', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'MACHINE_NOT_FOUND', type: ErrorResponse })
  @ApiResponse({
    status: 409,
    description: 'MONITORING_POINT_NAME_CONFLICT — o nome é único dentro da máquina.',
    type: ErrorResponse,
  })
  create(@Body() body: unknown): Promise<MonitoringPointDto> {
    return this.monitoringPoints.create(parseCreateMonitoringPointDto(body));
  }

  @Get()
  @ApiOperation({
    summary: 'Lista paginada e ordenável (a interface usa sempre 5 por página)',
    description:
      'Ordena pelo vocabulário público exibido na tabela (ex.: HF+ < TcAg < TcAs), pontos sem sensor ao final. Parâmetros desconhecidos são 400.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE, default: 1 },
  })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: 50, default: 5 } })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    schema: { type: 'string', enum: ['machineName', 'machineType', 'pointName', 'sensorModel'], default: 'machineName' },
  })
  @ApiQuery({ name: 'sortDir', required: false, schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Busca por trecho, sem diferenciar maiúsculas, no nome da máquina, no nome do ponto e na série do sensor.',
    schema: { type: 'string', maxLength: 120 },
  })
  @ApiQuery({ name: 'machineType', required: false, schema: { type: 'string', enum: ['Pump', 'Fan'] } })
  @ApiQuery({ name: 'sensorModel', required: false, schema: { type: 'string', enum: ['TcAg', 'TcAs', 'HF+'] } })
  @ApiQuery({
    name: 'hasSensor',
    required: false,
    description: 'true devolve só pontos com sensor associado; false, só os sem sensor.',
    schema: { type: 'string', enum: ['true', 'false'] },
  })
  @ApiResponse({
    status: 200,
    description:
      'Página do recorte pedido. `total` e `totalPages` refletem busca e filtros — não são o tamanho da tabela.',
    type: MonitoringPointPageResponse,
  })
  @ApiResponse({
    status: 400,
    description:
      'INVALID_MONITORING_POINT_QUERY — parâmetro desconhecido ou valor fora do vocabulário. Recusar é deliberado: um filtro ignorado em silêncio faria o cliente crer que filtrou.',
    type: ErrorResponse,
  })
  list(@Query() query: Record<string, unknown>): Promise<MonitoringPointPageDto> {
    return this.monitoringPoints.list(parseListMonitoringPointsQuery(query));
  }

  @Post(':id/sensor')
  @ApiResponse({
    status: 403,
    description: 'Perfil VIEWER: este endpoint altera estado e exige perfil administrador.',
    type: ErrorResponse,
  })
  @ApiOperation({ summary: 'Associa um sensor novo ao ponto (máx. 1 por ponto)' })
  @ApiBody({
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['serialNumber', 'model'],
      properties: {
        serialNumber: { type: 'string', maxLength: 60, example: 'SIM-HF-003' },
        model: { type: 'string', enum: ['TcAg', 'TcAs', 'HF+'], example: 'HF+' },
      },
    },
    examples: {
      emBomba: {
        summary: 'Em máquina Pump — só HF+ é aceito',
        value: { serialNumber: 'SIM-HF-003', model: 'HF+' },
      },
      emVentilador: {
        summary: 'Em máquina Fan — TcAg, TcAs e HF+ são aceitos',
        value: { serialNumber: 'SIM-TCAG-003', model: 'TcAg' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Sensor associado; o ponto passa a devolvê-lo em `sensor`.',
    type: MonitoringPointResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'INVALID_MONITORING_POINT_PAYLOAD | INVALID_SENSOR_MODEL',
    type: ErrorResponse,
  })
  @ApiResponse({ status: 404, description: 'MONITORING_POINT_NOT_FOUND', type: ErrorResponse })
  @ApiResponse({
    status: 409,
    description:
      'SENSOR_MODEL_NOT_ALLOWED (máquina Pump recusa TcAg/TcAs) | SENSOR_SERIAL_CONFLICT (série já usada) | MONITORING_POINT_SENSOR_CONFLICT (o ponto já tem sensor)',
    type: ErrorResponse,
  })
  assignSensor(@Param('id') id: string, @Body() body: unknown): Promise<MonitoringPointDto> {
    return this.monitoringPoints.assignSensor(id, parseAssignSensorDto(body));
  }
}
