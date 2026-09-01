/**
 * Rotas de alertas. Leitura liberada para ADMIN e VIEWER pelo guard global (método seguro);
 * o reconhecimento é mutação e, pela regra padrão do guard, exige ADMIN — por isso só ele
 * publica 403.
 */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  ALERT_LEVELS,
  ALERT_LIST_SORT_COLUMNS,
  ALERT_STATUS_FILTERS,
  ALERT_TYPES,
  type AlertDetailDto,
  type AlertListResponseDto,
} from '@dynamox/domain';

import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-auth.guard';
import { AlertDetailResponse, AlertListResponse, ErrorResponse } from '../common/api-schemas';
import { AlertsQueryService } from './alerts-query.service';
import {
  DEFAULT_PAGE_SIZE,
  MAX_NOTE_LENGTH,
  MAX_PAGE,
  MAX_PAGE_SIZE,
  SORT_DIRECTIONS,
  parseAcknowledgeDto,
  parseAlertIdParam,
  parseAlertListQuery,
} from './alerts.dto';

@ApiTags('alerts')
@ApiBearerAuth('bearer')
@ApiResponse({ status: 401, description: 'Token ausente, inválido ou expirado', type: ErrorResponse })
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alerts: AlertsQueryService) {}

  @Get()
  @ApiOperation({ summary: 'Lista episódios de alerta (A1/A2) com recorte por status, nível, tipo, máquina, sensor e janela' })
  @ApiQuery({ name: 'status', required: false, description: '`active` = aberto ∪ reconhecido. Sem recorte, todos; `counts` descreve sempre o universo antes deste recorte.', schema: { type: 'string', enum: [...ALERT_STATUS_FILTERS] } })
  @ApiQuery({ name: 'level', required: false, schema: { type: 'string', enum: [...ALERT_LEVELS] } })
  @ApiQuery({ name: 'type', required: false, schema: { type: 'string', enum: [...ALERT_TYPES] } })
  @ApiQuery({ name: 'machine', required: false, description: 'Nome cadastrado ou etiqueta curta da máquina (mesma resolução das rotas analíticas).', schema: { type: 'string' } })
  @ApiQuery({ name: 'sensor', required: false, description: 'Número de série do sensor.', schema: { type: 'string' } })
  @ApiQuery({ name: 'search', required: false, description: 'Busca textual sem distinção de maiúsculas no número de série do sensor, no nome da máquina ou no nome do ponto — sobre os snapshots do episódio.', schema: { type: 'string', maxLength: 120 } })
  @ApiQuery({ name: 'from', required: false, description: 'Interseção temporal: entram alertas ativos em algum instante de [from, to) — `openedAt < to AND (resolvedAt IS NULL OR resolvedAt >= from)`.', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela de interseção (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE, default: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE_SIZE, default: DEFAULT_PAGE_SIZE } })
  @ApiQuery({ name: 'sortBy', required: false, schema: { type: 'string', enum: [...ALERT_LIST_SORT_COLUMNS], default: 'openedAt' } })
  @ApiQuery({ name: 'sortDir', required: false, schema: { type: 'string', enum: [...SORT_DIRECTIONS], default: 'desc' } })
  @ApiResponse({ status: 200, description: 'Página de episódios com contagens do universo consultado.', type: AlertListResponse })
  @ApiResponse({ status: 400, description: 'INVALID_ALERTS_QUERY | AMBIGUOUS_MACHINE_KEY', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'MACHINE_NOT_FOUND (recorte por máquina inexistente).', type: ErrorResponse })
  list(@Query() query: Record<string, unknown>): Promise<AlertListResponseDto> {
    return this.alerts.list(parseAlertListQuery(query));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Um episódio com a regra aplicada, a baseline aprendida do ponto e a linha do tempo de transições',
  })
  @ApiParam({ name: 'id', description: 'Identificador do alerta.', schema: { type: 'string', format: 'uuid' } })
  @ApiResponse({ status: 200, description: 'Episódio, regra e eventos.', type: AlertDetailResponse })
  @ApiResponse({ status: 400, description: 'INVALID_ALERTS_QUERY (identificador não é UUID).', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'ALERT_NOT_FOUND', type: ErrorResponse })
  detail(@Param('id') id: string): Promise<AlertDetailDto> {
    return this.alerts.detail(parseAlertIdParam(id));
  }

  @Post(':id/acknowledge')
  // Reconhecer não cria recurso: a resposta é o próprio episódio, então 200 e não 201.
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 403,
    description: 'Perfil VIEWER: reconhecer altera estado e exige perfil administrador.',
    type: ErrorResponse,
  })
  @ApiOperation({ summary: 'Reconhece um alerta ("vi"): não resolve nem silencia; idempotente; permitido em episódio resolvido' })
  @ApiParam({ name: 'id', description: 'Identificador do alerta.', schema: { type: 'string', format: 'uuid' } })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        note: { type: 'string', maxLength: MAX_NOTE_LENGTH, nullable: true, example: 'Inspeção visual agendada para o turno da manhã.' },
      },
    },
    examples: {
      comNota: { summary: 'Com nota (o corpo é opcional: sem nota, envie vazio)', value: { note: 'Inspeção visual agendada para o turno da manhã.' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Episódio com o reconhecimento registrado (ou já registrado antes).', type: AlertDetailResponse })
  @ApiResponse({ status: 400, description: 'INVALID_ACKNOWLEDGE_PAYLOAD | INVALID_ALERTS_QUERY', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'ALERT_NOT_FOUND', type: ErrorResponse })
  acknowledge(@Param('id') id: string, @Body() body: unknown, @CurrentUser() user: JwtPayload): Promise<AlertDetailDto> {
    return this.alerts.acknowledge(parseAlertIdParam(id), parseAcknowledgeDto(body), { sub: user.sub, email: user.email });
  }
}
