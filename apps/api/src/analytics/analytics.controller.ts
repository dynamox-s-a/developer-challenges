/**
 * Rotas analíticas: agregação recortada por janela temporal.
 *
 * Leitura é liberada para ADMIN e VIEWER pelo guard global (método seguro), então não há
 * `@Roles` aqui — e, por isso mesmo, nenhuma resposta 403 é publicada.
 */
import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type {
  AcquisitionDetailDto,
  AcquisitionPageDto,
  MachineListResponseDto,
  MachineSummaryDto,
  FleetConditionResponseDto,
  PointSummaryDto,
  HeatmapResponseDto,
  RawSamplePageDto,
  SeriesPointsResponseDto,
  TimeWindowResponseDto,
} from '@dynamox/domain';
import {
  CONDITION_KINDS,
  MACHINE_LIST_SORT_COLUMNS,
  matchesPointKey,
  resolveByNaturalKey,
  type ConditionKind,
  type MachineListSortColumn,
} from '@dynamox/domain';

import {
  AcquisitionDetailResponse,
  AcquisitionPageResponse,
  MachineListResponse,
  MachineSummaryResponse,
  ErrorResponse,
  PointSummaryResponse,
  FleetConditionResponse,
  HeatmapResponse,
  RawSamplePageResponse,
  SeriesPointsResponse,
  TimeWindowResponse,
} from '../common/api-schemas';
import { AnalyticsService } from './analytics.service';
import {
  ACQUISITIONS_QUERY_KEYS,
  MACHINE_QUERY_KEYS,
  POINT_QUERY_KEYS,
  DEFAULT_PAGE_SIZE,
  MACHINE_LIST_QUERY_KEYS,
  SORT_DIRECTIONS,
  DEFAULT_SAMPLES_LIMIT,
  FLEET_CONDITION_QUERY_KEYS,
  HEATMAP_QUERY_KEYS,
  MAX_PAGE,
  MAX_PAGE_SIZE,
  MAX_SAMPLES_LIMIT,
  RAW_SAMPLES_QUERY_KEYS,
  SAMPLE_AXES,
  SAMPLE_QUANTITIES,
  SERIES_POINTS_QUERY_KEYS,
  TIME_WINDOW_QUERY_KEYS,
  ambiguousResourceKey,
  assertKnownKeys,
  parseBoundedInt,
  parseEnum,
  parseOptionalBoolean,
  parseOptionalEnum,
  parseOptionalString,
  parseTimeRange,
  parseUuidParam,
} from './analytics.dto';
import { HEATMAP_BUCKETS, SERIES_BUCKETS } from './analytics.sql';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('analytics')
@ApiBearerAuth('bearer')
@ApiResponse({ status: 401, description: 'Token ausente, inválido ou expirado', type: ErrorResponse })
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('fleet-condition')
  @ApiOperation({
    summary: 'Condição de cada ponto na janela, com aquisição atual e referência',
  })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'includeTrend', required: false, description: 'Inclui a tendência curta de cada ponto (até 12 buckets das últimas 24 h).', schema: { type: 'boolean', default: false } })
  @ApiResponse({ status: 200, description: 'Condição por ponto monitorado.', type: FleetConditionResponse })
  @ApiResponse({ status: 400, description: 'Janela ausente, invertida, longa demais ou parâmetro desconhecido.', type: ErrorResponse })
  @ApiQuery({ name: 'condition', required: false, description: 'Recorta os pontos por condição; `counts` continua descrevendo o universo inteiro.', schema: { type: 'string', enum: [...CONDITION_KINDS] } })
  fleetCondition(@Query() query: Record<string, unknown>): Promise<FleetConditionResponseDto> {
    assertKnownKeys(query, FLEET_CONDITION_QUERY_KEYS);
    return this.analytics.fleetCondition(parseTimeRange(query), {
      includeTrend: parseOptionalBoolean(query.includeTrend, 'includeTrend'),
      condition: parseOptionalEnum<ConditionKind>(query.condition, 'condition', CONDITION_KINDS),
    });
  }

  @Get('machines')
  @ApiOperation({ summary: 'Listagem operacional de máquinas, com recorte por condição' })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'condition', required: false, description: 'Recorta pelas máquinas cuja condição (a pior entre os pontos) seja esta.', schema: { type: 'string', enum: [...CONDITION_KINDS] } })
  @ApiQuery({ name: 'search', required: false, description: 'Busca no nome da máquina, sem distinguir acento nem caixa.', schema: { type: 'string' } })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE, default: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE_SIZE, default: DEFAULT_PAGE_SIZE } })
  @ApiQuery({ name: 'sortBy', required: false, schema: { type: 'string', enum: [...MACHINE_LIST_SORT_COLUMNS], default: 'name' } })
  @ApiQuery({ name: 'sortDir', required: false, schema: { type: 'string', enum: [...SORT_DIRECTIONS], default: 'asc' } })
  @ApiResponse({ status: 200, description: 'Página de máquinas com condição, inventário e maior desvio.', type: MachineListResponse })
  @ApiResponse({ status: 400, description: 'Janela, recorte ou paginação inválidos.', type: ErrorResponse })
  machineList(@Query() query: Record<string, unknown>): Promise<MachineListResponseDto> {
    assertKnownKeys(query, MACHINE_LIST_QUERY_KEYS);
    return this.analytics.machineList(parseTimeRange(query), {
      condition: parseOptionalEnum<ConditionKind>(query.condition, 'condition', CONDITION_KINDS),
      search: parseOptionalString(query.search, 'search', 120),
      page: parseBoundedInt(query.page, 'page', 1, 1, MAX_PAGE),
      pageSize: parseBoundedInt(query.pageSize, 'pageSize', DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE),
      sortBy: parseEnum<MachineListSortColumn>(query.sortBy, 'sortBy', MACHINE_LIST_SORT_COLUMNS, 'name'),
      sortDir: parseEnum(query.sortDir, 'sortDir', SORT_DIRECTIONS, 'asc'),
    });
  }

  @Get('machines/:machineKey')
  @ApiOperation({ summary: 'Resumo analítico de uma máquina e dos seus pontos na janela' })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'condition', required: false, description: 'Recorta os pontos listados; os indicadores continuam descrevendo a máquina inteira.', schema: { type: 'string', enum: [...CONDITION_KINDS] } })
  @ApiResponse({ status: 200, description: 'Máquina, indicadores e pontos monitorados.', type: MachineSummaryResponse })
  @ApiResponse({ status: 400, description: 'Janela inválida ou identificador ambíguo.', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Máquina inexistente.', type: ErrorResponse })
  async machineSummary(
    @Param('machineKey') machineKey: string,
    @Query() query: Record<string, unknown>,
  ): Promise<MachineSummaryDto> {
    assertKnownKeys(query, MACHINE_QUERY_KEYS);
    const machine = await this.resolveMachine(machineKey);
    return this.analytics.machineSummary(machine, parseTimeRange(query), {
      condition: parseOptionalEnum<ConditionKind>(query.condition, 'condition', CONDITION_KINDS),
    });
  }

  @Get('machines/:machineKey/points/:pointKey')
  @ApiOperation({ summary: 'Resumo analítico de um ponto de monitoramento na janela' })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiResponse({ status: 200, description: 'Ponto, condição, janela e séries disponíveis.', type: PointSummaryResponse })
  @ApiResponse({ status: 400, description: 'Janela inválida ou identificador ambíguo.', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Máquina ou ponto inexistente.', type: ErrorResponse })
  async pointSummary(
    @Param('machineKey') machineKey: string,
    @Param('pointKey') pointKey: string,
    @Query() query: Record<string, unknown>,
  ): Promise<PointSummaryDto> {
    assertKnownKeys(query, POINT_QUERY_KEYS);
    const machine = await this.resolveMachine(machineKey);
    const points = await this.prisma.monitoringPoint.findMany({
      where: { machineId: machine.id },
      select: { id: true, name: true },
    });
    const resolved = resolveByNaturalKey(points, pointKey, (point) => point.name, matchesPointKey);
    if (resolved.kind === 'ambiguous') {
      throw ambiguousResourceKey(
        'AMBIGUOUS_POINT_KEY',
        `O identificador "${pointKey}" corresponde a mais de um ponto de "${machine.name}".`,
      );
    }
    if (resolved.kind === 'not-found') {
      throw new NotFoundException({
        code: 'MONITORING_POINT_NOT_FOUND',
        message: `Ponto "${pointKey}" não encontrado em "${machine.name}".`,
      });
    }
    return this.analytics.pointSummary(machine, resolved.item, parseTimeRange(query));
  }

  @Get('series/:seriesId/points')
  @ApiOperation({ summary: 'Série agregada por bucket temporal, com estatísticas da janela' })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'bucket', required: false, description: 'Tamanho do bucket temporal.', schema: { type: 'string', enum: [...SERIES_BUCKETS], default: '1h' } })
  @ApiResponse({ status: 200, description: 'Pontos agregados da série.', type: SeriesPointsResponse })
  @ApiResponse({ status: 400, description: 'Janela ou bucket inválidos.', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Série inexistente.', type: ErrorResponse })
  async seriesPoints(
    @Param('seriesId') seriesId: string,
    @Query() query: Record<string, unknown>,
  ): Promise<SeriesPointsResponseDto> {
    assertKnownKeys(query, SERIES_POINTS_QUERY_KEYS);
    const id = parseUuidParam(seriesId, 'seriesId');
    const range = parseTimeRange(query);
    const bucket = parseEnum(query.bucket, 'bucket', SERIES_BUCKETS, '1h');

    const exists = await this.prisma.timeSeries.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException({
        code: 'TIME_SERIES_NOT_FOUND',
        message: `Série temporal "${id}" não encontrada.`,
      });
    }

    return this.analytics.seriesPoints(id, range, bucket);
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Mapa de atividade da frota por bucket temporal' })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'bucket', required: false, description: 'Granularidade das células.', schema: { type: 'string', enum: [...HEATMAP_BUCKETS], default: 'hour' } })
  @ApiResponse({ status: 200, description: 'Células com cobertura e atividade.', type: HeatmapResponse })
  @ApiResponse({ status: 400, description: 'Janela ou bucket inválidos.', type: ErrorResponse })
  heatmap(@Query() query: Record<string, unknown>): Promise<HeatmapResponseDto> {
    assertKnownKeys(query, HEATMAP_QUERY_KEYS);
    return this.analytics.heatmap(
      parseTimeRange(query),
      parseEnum(query.bucket, 'bucket', HEATMAP_BUCKETS, 'hour'),
    );
  }

  @Get('time-windows')
  @ApiOperation({ summary: 'Resumo por sensor de uma janela temporal específica' })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE, default: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE_SIZE, default: DEFAULT_PAGE_SIZE } })
  @ApiResponse({ status: 200, description: 'Sensores da janela com estatísticas agregadas.', type: TimeWindowResponse })
  @ApiResponse({ status: 400, description: 'Janela ou paginação inválidas.', type: ErrorResponse })
  timeWindow(@Query() query: Record<string, unknown>): Promise<TimeWindowResponseDto> {
    assertKnownKeys(query, TIME_WINDOW_QUERY_KEYS);
    return this.analytics.timeWindow(
      parseTimeRange(query),
      parseBoundedInt(query.page, 'page', 1, 1, MAX_PAGE),
      parseBoundedInt(query.pageSize, 'pageSize', DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE),
    );
  }

  @Get('sensors/:serialNumber/acquisitions')
  @ApiOperation({ summary: 'Aquisições de um sensor na janela, paginadas no servidor' })
  @ApiQuery({ name: 'from', required: false, description: 'Início da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'to', required: false, description: 'Fim exclusivo da janela (ISO 8601 UTC).', schema: { type: 'string', format: 'date-time' } })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE, default: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_PAGE_SIZE, default: DEFAULT_PAGE_SIZE } })
  @ApiQuery({ name: 'includeTotal', required: false, description: 'Inclui a contagem total (custa uma varredura da janela).', schema: { type: 'boolean', default: false } })
  @ApiResponse({ status: 200, description: 'Página de aquisições.', type: AcquisitionPageResponse })
  @ApiResponse({ status: 400, description: 'Janela ou paginação inválidas.', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Sensor inexistente.', type: ErrorResponse })
  async sensorAcquisitions(
    @Param('serialNumber') serialNumber: string,
    @Query() query: Record<string, unknown>,
  ): Promise<AcquisitionPageDto> {
    assertKnownKeys(query, ACQUISITIONS_QUERY_KEYS);
    const sensor = await this.prisma.sensor.findUnique({
      where: { serialNumber },
      select: { serialNumber: true },
    });
    if (!sensor) {
      throw new NotFoundException({
        code: 'SENSOR_NOT_FOUND',
        message: `Sensor "${serialNumber}" não encontrado.`,
      });
    }
    return this.analytics.sensorAcquisitions(
      sensor.serialNumber,
      parseTimeRange(query),
      parseBoundedInt(query.page, 'page', 1, 1, MAX_PAGE),
      parseBoundedInt(query.pageSize, 'pageSize', DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE),
      parseOptionalBoolean(query.includeTotal, 'includeTotal'),
    );
  }

  @Get('acquisitions/:cycleId')
  @ApiOperation({ summary: 'Detalhe de uma aquisição com resumo por série' })
  @ApiResponse({ status: 200, description: 'Aquisição e estatísticas por série.', type: AcquisitionDetailResponse })
  @ApiResponse({ status: 400, description: 'Identificador inválido.', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Aquisição inexistente.', type: ErrorResponse })
  async acquisition(@Param('cycleId') cycleId: string): Promise<AcquisitionDetailDto> {
    const detail = await this.analytics.acquisition(parseUuidParam(cycleId, 'cycleId'));
    if (!detail) {
      throw new NotFoundException({
        code: 'ACQUISITION_NOT_FOUND',
        message: `Aquisição "${cycleId}" não encontrada.`,
      });
    }
    return detail;
  }

  @Get('acquisitions/:cycleId/samples')
  @ApiOperation({ summary: 'Amostras brutas de uma aquisição, por cursor keyset' })
  @ApiQuery({ name: 'limit', required: false, schema: { type: 'integer', minimum: 1, maximum: MAX_SAMPLES_LIMIT, default: DEFAULT_SAMPLES_LIMIT } })
  @ApiQuery({ name: 'cursor', required: false, description: 'Cursor devolvido pela página anterior.', schema: { type: 'string' } })
  @ApiQuery({ name: 'quantity', required: false, schema: { type: 'string', enum: [...SAMPLE_QUANTITIES] } })
  @ApiQuery({ name: 'axis', required: false, schema: { type: 'string', enum: [...SAMPLE_AXES] } })
  @ApiResponse({ status: 200, description: 'Página de amostras brutas da aquisição.', type: RawSamplePageResponse })
  @ApiResponse({ status: 400, description: 'Filtro, limite ou cursor inválidos.', type: ErrorResponse })
  @ApiResponse({ status: 404, description: 'Aquisição inexistente.', type: ErrorResponse })
  async acquisitionSamples(
    @Param('cycleId') cycleId: string,
    @Query() query: Record<string, unknown>,
  ): Promise<RawSamplePageDto> {
    assertKnownKeys(query, RAW_SAMPLES_QUERY_KEYS);
    const id = parseUuidParam(cycleId, 'cycleId');
    const exists = await this.prisma.ingestionCycle.findUnique({ where: { id }, select: { id: true } });
    if (!exists) {
      throw new NotFoundException({
        code: 'ACQUISITION_NOT_FOUND',
        message: `Aquisição "${id}" não encontrada.`,
      });
    }
    return this.analytics.acquisitionSamples(
      id,
      parseBoundedInt(query.limit, 'limit', DEFAULT_SAMPLES_LIMIT, 1, MAX_SAMPLES_LIMIT),
      parseOptionalString(query.cursor, 'cursor', 256),
      {
        quantity: parseOptionalEnum(query.quantity, 'quantity', SAMPLE_QUANTITIES),
        axis: parseOptionalEnum(query.axis, 'axis', SAMPLE_AXES),
      },
    );
  }

  /**
   * Resolve o identificador legível da URL contra o nome cadastrado (ou a etiqueta curta).
   * A tabela de máquinas tem unidades, não milhares: uma leitura completa é mais barata
   * que uma consulta por padrão, e mantém a regra de casamento num lugar só — o domínio.
   */
  private async resolveMachine(
    machineKey: string,
  ): Promise<{ id: string; name: string; type: 'PUMP' | 'FAN'; createdAt: Date; updatedAt: Date }> {
    const machines = await this.prisma.machine.findMany({
      select: { id: true, name: true, type: true, createdAt: true, updatedAt: true },
    });
    const resolved = resolveByNaturalKey(machines, machineKey, (machine) => machine.name);
    if (resolved.kind === 'ambiguous') {
      throw ambiguousResourceKey(
        'AMBIGUOUS_MACHINE_KEY',
        `O identificador "${machineKey}" corresponde a mais de uma máquina: ${resolved.items
          .map((machine) => machine.name)
          .join(', ')}.`,
      );
    }
    if (resolved.kind === 'not-found') {
      throw new NotFoundException({
        code: 'MACHINE_NOT_FOUND',
        message: `Máquina "${machineKey}" não encontrada.`,
      });
    }
    return resolved.item;
  }
}
