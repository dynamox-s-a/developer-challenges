/**
 * Camada analítica: consulta recortada, agregação no PostgreSQL, DTO pequeno.
 *
 * Regra do módulo: nenhuma resposta daqui pode crescer com o tamanho do histórico.
 * Quem quiser telemetria bruta usa as rotas de amostras, sempre paginadas.
 */
import { Injectable, Logger } from '@nestjs/common';
import type {
  AcquisitionDetailDto,
  AcquisitionPageDto,
  MachineListItemDto,
  MachineListResponseDto,
  MachineListSortColumn,
  MachinePointSummaryDto,
  MachineSummaryDto,
  ConditionKind,
  HeatmapResponseDto,
  RawSamplePageDto,
  TimeWindowResponseDto,
  FleetConditionPoint,
  FleetConditionResponseDto,
  PointSummaryDto,
  SeriesPointsResponseDto,
  TrendPointDto,
} from '@dynamox/domain';
import {
  CONDITION_SEVERITY,
  DEFAULT_CONDITION_POLICY,
  classifyCondition,
  classifyFreshness,
  countConditions,
  deviationRatio,
  machineSlug,
  naturalKey,
  pointSlug,
  worstCondition,
} from '@dynamox/domain';
import { toDomainAxis, toDomainPhysicalQuantity } from '../telemetry/telemetry.mappers';

import { toDomainMachineType } from '../common/machine-type.mapper';
import { toDomainSensorModel } from '../common/sensor-model.mapper';
import { PrismaService } from '../prisma/prisma.service';
import type { TimeRange } from './analytics.dto';
import {
  type AcquisitionSource,
  anchoredEvaluationFrom,
  acquisitionSamplesSql,
  acquisitionSeriesSql,
  fleetConditionSql,
  heatmapSeveritySql,
  heatmapSamplesSql,
  heatmapSql,
  pointSeriesSql,
  sensorAcquisitionsCountSql,
  sensorAcquisitionsSql,
  sensorTrendSql,
  seriesPointsSql,
  seriesStatsSql,
  timeWindowSql,
  type HeatmapBucket,
  type SeriesBucket,
} from './analytics.sql';

/**
 * A regra de condição mora em `@dynamox/domain` (`condition.ts`) — uma implementação só para
 * API e web. Os nomes abaixo continuam exportados como aliases da política v1 para que os
 * chamadores e os testes de caracterização não precisem conhecer a estrutura da política.
 */
export const ATTENTION_RATIO = DEFAULT_CONDITION_POLICY.attentionRatio;
export const OBSERVATION_RATIO = DEFAULT_CONDITION_POLICY.observationRatio;
export const STALE_AFTER_MS = DEFAULT_CONDITION_POLICY.staleAfterMs;
export const FUTURE_TOLERANCE_MS = DEFAULT_CONDITION_POLICY.futureToleranceMs;
export { classifyCondition, classifyFreshness, deviationRatio };

interface TimeWindowRow {
  serial: string;
  model: 'TC_AG' | 'TC_AS' | 'HF_PLUS';
  series_id: string;
  point_name: string | null;
  point_id: string | null;
  machine_id: string | null;
  machine_name: string | null;
  machine_type: 'PUMP' | 'FAN' | null;
  samples: bigint | null;
  acquisitions: bigint | null;
  min: number | null;
  max: number | null;
  avg: number | null;
  last_at: Date | null;
  last_value: number | null;
}

interface AcquisitionRow {
  cycle_id: string;
  external_cycle_id: string | null;
  sample_count: number;
  measurement_count: number;
  configuration: unknown;
  metadata: unknown;
  tags: string[];
  ingested_at: Date;
  started_at: Date | null;
  ended_at: Date | null;
  min: number | null;
  max: number | null;
  avg: number | null;
  samples: bigint | null;
}

interface AcquisitionSeriesRow {
  series_id: string;
  physical_quantity: 'ACCELERATION' | 'VELOCITY' | 'TEMPERATURE' | 'ROTATIONAL_SPEED';
  axis: 'X' | 'Y' | 'Z' | 'NONE';
  unit: string;
  samples: bigint;
  min: number | null;
  max: number | null;
  avg: number | null;
  rms: number | null;
  started_at: Date | null;
  ended_at: Date | null;
}

interface RawSampleRow {
  id: string;
  timestamp: Date;
  value: number;
  physical_quantity: 'ACCELERATION' | 'VELOCITY' | 'TEMPERATURE' | 'ROTATIONAL_SPEED';
  axis: 'X' | 'Y' | 'Z' | 'NONE';
  unit: string;
}

/** Cursor keyset opaco: instante + id da última linha entregue. */
export function encodeCursor(timestamp: Date, id: string): string {
  return Buffer.from(`${timestamp.toISOString()}|${id}`).toString('base64url');
}

export function decodeCursor(cursor: string | null): { timestamp: Date; id: string } | null {
  if (!cursor) return null;
  const [timestamp, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
  const parsed = Date.parse(timestamp ?? '');
  if (!Number.isFinite(parsed) || !id) return null;
  return { timestamp: new Date(parsed), id };
}

interface HeatmapRow {
  day: Date;
  hour: number;
  samples: bigint;
  acquisitions: string | number;
  sensors: bigint;
}

interface HeatmapSeverityRow {
  day: Date;
  hour: number;
  ratio: number | null;
  rms: number | null;
  serial: string | null;
  point_name: string | null;
  machine_name: string | null;
}

interface SeriesPointRow {
  bucket_start: Date;
  samples: bigint;
  avg: number | null;
  min: number | null;
  max: number | null;
  last_at: Date | null;
  acquisitions: bigint;
}

interface SeriesStatsRow {
  samples: bigint;
  acquisitions: bigint;
  min: number | null;
  max: number | null;
  avg: number | null;
  first_at: Date | null;
  last_at: Date | null;
}

interface TrendRow {
  serial: string;
  bucket_start: Date;
  rms: number | null;
}

interface PointSeriesRow {
  series_id: string;
  physical_quantity: 'ACCELERATION' | 'VELOCITY' | 'TEMPERATURE' | 'ROTATIONAL_SPEED';
  axis: 'X' | 'Y' | 'Z' | 'NONE';
  unit: string;
  last_value: number | null;
  last_at: Date | null;
}

interface FleetConditionRow {
  machine_id: string;
  machine_name: string;
  machine_type: 'PUMP' | 'FAN';
  monitoring_point_id: string;
  monitoring_point_name: string;
  sensor_serial: string | null;
  sensor_model: 'TC_AG' | 'TC_AS' | 'HF_PLUS' | null;
  current_rms: number | null;
  baseline_rms: number | null;
  current_at: Date | null;
  baseline_at: Date | null;
  current_samples: bigint | null;
  current_cycle_id: string | null;
  baseline_cycle_id: string | null;
  last_seen_at: Date | null;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Observabilidade barata: endpoint, duração e itens devolvidos, sem instrumentação nova. */
  private async measured<T>(label: string, run: () => Promise<T>, size: (result: T) => number): Promise<T> {
    const startedAt = Date.now();
    const result = await run();
    this.logger.debug(`${label} · ${Date.now() - startedAt} ms · ${size(result)} item(s)`);
    return result;
  }

  /**
   * Janela em que a condição é avaliada: as últimas 24 h DE DADO do recorte pedido — a
   * mesma janela que a tendência curta acompanha, para que miniatura e razão falem do
   * mesmo período. A âncora é a última amostra antes de `to`, não o relógio da consulta:
   * ver `anchoredEvaluationFrom`.
   */
  private async evaluationWindow(range: TimeRange): Promise<TimeRange> {
    const dataEnd = await this.dataEndBefore(range.to);
    return {
      from: anchoredEvaluationFrom(range.from.getTime(), range.to.getTime(), dataEnd?.getTime() ?? null),
      to: range.to,
    };
  }

  /**
   * Última AQUISIÇÃO persistida antes de `to` — pelo índice (série, instante), uma sonda por
   * série. Só amostras com ciclo de ingestão contam: a condição é calculada sobre aquisições,
   * e uma amostra avulsa (o seed mínimo grava 30 delas ancoradas no relógio da execução)
   * não pode puxar a âncora para um instante em que não houve aquisição alguma.
   */
  private async dataEndBefore(to: Date): Promise<Date | null> {
    const rows = await this.prisma.$queryRaw<Array<{ last: Date | null }>>`
      SELECT max(l.last) AS last
      FROM time_series ts
      CROSS JOIN LATERAL (
        SELECT max(p."timestamp") AS last
        FROM time_series_samples p
        WHERE p."timeSeriesId" = ts.id AND p."timestamp" < ${to} AND p."ingestionCycleId" IS NOT NULL
      ) l
    `;
    return rows[0]?.last ?? null;
  }

  /**
   * De onde contar aquisições numa janela: o ledger de evidência por ciclo quando ele a
   * cobre (uma linha por aquisição — milissegundos), senão as próprias amostras
   * (`count(DISTINCT ciclo)`, correto e ~10× mais caro). O ledger só falta para dado
   * carregado com o motor desligado e ainda sem backfill, ou inserido fora da API.
   */
  private async acquisitionSource(range: TimeRange, serialNumbers?: readonly string[]): Promise<AcquisitionSource> {
    if (serialNumbers !== undefined && serialNumbers.length === 0) return 'samples';
    const covered = await this.prisma.alertCycleEvidence.count({
      where: {
        startedAt: { gte: range.from, lt: range.to },
        ...(serialNumbers ? { sensorSerialNumber: { in: [...serialNumbers] } } : {}),
      },
    });
    return covered > 0 ? 'ledger' : 'samples';
  }

  /** Tendência curta por sensor, agregada no banco. Doze valores por sensor, no máximo. */
  private async trendBySensor(
    window: TimeRange,
    serialNumbers?: readonly string[],
  ): Promise<Map<string, TrendPointDto[]>> {
    const rows = await this.prisma.$queryRaw<TrendRow[]>(
      sensorTrendSql(window.from, window.to, serialNumbers),
    );
    const trend = new Map<string, TrendPointDto[]>();
    for (const row of rows) {
      if (row.rms === null) continue;
      const points = trend.get(row.serial) ?? [];
      points.push({ timestamp: row.bucket_start.toISOString(), value: row.rms });
      trend.set(row.serial, points);
    }
    return trend;
  }

  async fleetCondition(
    range: TimeRange,
    options: { includeTrend?: boolean; condition?: ConditionKind | null } = {},
    nowMs = Date.now(),
  ): Promise<FleetConditionResponseDto> {
    return this.measured(
      'analytics/fleet-condition',
      async () => {
        const window = await this.evaluationWindow(range);
        const rows = await this.prisma.$queryRaw<FleetConditionRow[]>(
          fleetConditionSql(window.from, window.to),
        );
        const trend = options.includeTrend
          ? await this.trendBySensor(window)
          : new Map<string, TrendPointDto[]>();

        const points: FleetConditionPoint[] = rows.map((row) => {
          const hasSensor = row.sensor_serial !== null;
          const currentValue = row.current_rms;
          const baselineValue = row.baseline_rms;
          const ratio = deviationRatio(currentValue, baselineValue);

          return {
            machineName: row.machine_name,
            machineType: toDomainMachineType(row.machine_type),
            monitoringPointId: row.monitoring_point_id,
            monitoringPointName: row.monitoring_point_name,
            sensorSerialNumber: row.sensor_serial,
            sensorModel: row.sensor_model ? toDomainSensorModel(row.sensor_model) : null,
            condition: classifyCondition(hasSensor, currentValue !== null, ratio),
            freshness: classifyFreshness(row.last_seen_at ?? row.current_at, nowMs),
            currentValue,
            baselineValue,
            deviationRatio: ratio,
            currentAt: row.current_at?.toISOString() ?? null,
            baselineAt: row.baseline_at?.toISOString() ?? null,
            // count(*) chega como bigint: sem Number() o JSON da resposta quebraria.
            currentSampleCount: row.current_samples === null ? null : Number(row.current_samples),
            currentCycleId: row.current_cycle_id,
            baselineCycleId: row.baseline_cycle_id,
            unit: 'g',
            trend: (row.sensor_serial && trend.get(row.sensor_serial)) || [],
          };
        });

        // A contagem é do universo INTEIRO, não do recorte: é ela que diz ao seletor
        // quantos itens cada condição tem — inclusive a que está filtrada agora.
        const counts = countConditions(points.map((point) => point.condition));
        const condition = options.condition ?? null;

        return {
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          generatedAt: new Date(nowMs).toISOString(),
          points: condition ? points.filter((point) => point.condition === condition) : points,
          counts,
          condition,
        };
      },
      (result) => result.points.length,
    );
  }

  /**
   * Série agregada por bucket + estatísticas da janela. Nenhuma amostra bruta sai daqui:
   * um gráfico de 30 dias recebe ~180 pontos, não as ~170 mil amostras do período.
   */
  async seriesPoints(
    seriesId: string,
    range: TimeRange,
    bucket: SeriesBucket,
  ): Promise<SeriesPointsResponseDto> {
    return this.measured(
      `analytics/series-points bucket=${bucket}`,
      async () => {
        const owner = await this.prisma.timeSeries.findUnique({
          where: { id: seriesId },
          select: { sensor: { select: { serialNumber: true } } },
        });
        const source = await this.acquisitionSource(range, owner?.sensor ? [owner.sensor.serialNumber] : undefined);
        const [points, stats] = await this.prisma.$transaction([
          this.prisma.$queryRaw<SeriesPointRow[]>(
            seriesPointsSql(seriesId, range.from, range.to, bucket, source),
          ),
          this.prisma.$queryRaw<SeriesStatsRow[]>(seriesStatsSql(seriesId, range.from, range.to, source)),
        ]);
        const summary = stats[0];

        return {
          seriesId,
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          bucket,
          stats: {
            sampleCount: Number(summary?.samples ?? 0),
            acquisitionCount: Number(summary?.acquisitions ?? 0),
            min: summary?.min ?? null,
            max: summary?.max ?? null,
            avg: summary?.avg ?? null,
            firstAt: summary?.first_at?.toISOString() ?? null,
            lastAt: summary?.last_at?.toISOString() ?? null,
          },
          points: points.map((row) => ({
            bucketStart: row.bucket_start.toISOString(),
            sampleCount: Number(row.samples),
            acquisitionCount: Number(row.acquisitions),
            avg: row.avg,
            min: row.min,
            max: row.max,
            lastAt: row.last_at?.toISOString() ?? null,
          })),
        };
      },
      (result) => result.points.length,
    );
  }

  /**
   * Mapa de atividade da frota por bucket. A série âncora (aceleração Y) de cada sensor
   * representa a aquisição; a resposta tem no máximo dias × 24 células, independentemente
   * de quantas amostras existam na janela.
   */
  async heatmap(range: TimeRange, bucket: HeatmapBucket): Promise<HeatmapResponseDto> {
    return this.measured(
      `analytics/heatmap bucket=${bucket}`,
      async () => {
        const anchors = await this.prisma.timeSeries.findMany({
          where: { physicalQuantity: 'ACCELERATION', axis: 'Y' },
          select: { id: true },
        });
        const expectedSensors = anchors.length;
        if (expectedSensors === 0) {
          return {
            from: range.from.toISOString(),
            to: range.to.toISOString(),
            bucket,
            expectedSensors: 0,
            buckets: [],
          };
        }

        // Cobertura e severidade são duas leituras do mesmo recorte: a primeira diz se o dado
        // chegou, a segunda diz o quanto ele estava ruim. Vão juntas em uma resposta só.
        // A atividade sai do ledger de evidência (uma linha por aquisição) quando ele cobre a
        // janela; sem ledger — carga com o motor desligado e sem backfill, ou dado inserido
        // fora da API — cai na varredura por amostras, correta e mais cara.
        const activitySql =
          (await this.acquisitionSource(range)) === 'ledger'
            ? heatmapSql(range.from, range.to, bucket)
            : heatmapSamplesSql(anchors.map((series) => series.id), range.from, range.to, bucket);
        const [rows, severityRows] = await Promise.all([
          this.prisma.$queryRaw<HeatmapRow[]>(activitySql),
          this.prisma.$queryRaw<HeatmapSeverityRow[]>(heatmapSeveritySql(range.from, range.to, bucket)),
        ]);
        const severityByBucket = new Map(
          severityRows.map((row) => [`${row.day.getTime()}:${row.hour}`, row]),
        );
        const spanMs = bucket === 'hour' ? 3_600_000 : 86_400_000;

        return {
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          bucket,
          expectedSensors,
          buckets: rows.map((row) => {
            const start = new Date(row.day.getTime() + row.hour * 3_600_000);
            const reporting = Number(row.sensors);
            const severity = severityByBucket.get(`${row.day.getTime()}:${row.hour}`);
            return {
              maxDeviationRatio: severity?.ratio ?? null,
              maxDeviationValue: severity?.rms ?? null,
              maxDeviationSensor: severity?.serial ?? null,
              maxDeviationMachine: severity?.machine_name ?? null,
              maxDeviationPoint: severity?.point_name ?? null,
              bucketStart: start.toISOString(),
              bucketEnd: new Date(start.getTime() + spanMs).toISOString(),
              day: row.day.toISOString().slice(0, 10),
              hour: row.hour,
              sampleCount: Number(row.samples),
              acquisitionCount: Math.round(Number(row.acquisitions)),
              reportingSensors: reporting,
              expectedSensors,
              coveragePercent: Number(((reporting / expectedSensors) * 100).toFixed(1)),
            };
          }),
        };
      },
      (result) => result.buckets.length,
    );
  }

  /**
   * Janela temporal: uma linha por sensor com o que ele fez no intervalo. A paginação é
   * feita sobre 12 linhas já agregadas — não sobre amostras.
   */
  async timeWindow(
    range: TimeRange,
    page: number,
    pageSize: number,
    serialNumbers?: readonly string[],
  ): Promise<TimeWindowResponseDto> {
    return this.measured(
      'analytics/time-window',
      async () => {
        const rows = await this.prisma.$queryRaw<TimeWindowRow[]>(
          timeWindowSql(range.from, range.to, serialNumbers, await this.acquisitionSource(range, serialNumbers)),
        );

        const items = rows.map((row) => ({
          sensorSerialNumber: row.serial,
          sensorModel: toDomainSensorModel(row.model),
          seriesId: row.series_id,
          machineName: row.machine_name,
          machineType: row.machine_type ? toDomainMachineType(row.machine_type) : null,
          monitoringPointId: row.point_id,
          monitoringPointName: row.point_name,
          sampleCount: Number(row.samples ?? 0),
          acquisitionCount: Number(row.acquisitions ?? 0),
          min: row.min,
          max: row.max,
          avg: row.avg,
          lastValue: row.last_value,
          lastAt: row.last_at?.toISOString() ?? null,
          unit: 'g',
        }));

        const reporting = items.filter((item) => item.sampleCount > 0);
        const strongest = reporting.reduce<(typeof items)[number] | null>(
          (best, item) => (item.max !== null && (best?.max ?? -Infinity) < item.max ? item : best),
          null,
        );
        const total = items.length;
        const start = (page - 1) * pageSize;

        return {
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          kpis: {
            reportingSensors: reporting.length,
            silentSensors: total - reporting.length,
            expectedSensors: total,
            acquisitionCount: items.reduce((sum, item) => sum + item.acquisitionCount, 0),
            sampleCount: items.reduce((sum, item) => sum + item.sampleCount, 0),
            maxValue: strongest?.max ?? null,
            maxValueSensor: strongest?.sensorSerialNumber ?? null,
          },
          items: items.slice(start, start + pageSize),
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        };
      },
      (result) => result.items.length,
    );
  }

  /** Aquisições de um sensor, paginadas no servidor. `total` só quando pedido. */
  async sensorAcquisitions(
    serialNumber: string,
    range: TimeRange,
    page: number,
    pageSize: number,
    includeTotal: boolean,
  ): Promise<AcquisitionPageDto> {
    return this.measured(
      'analytics/sensor-acquisitions',
      async () => {
        // Uma linha a mais revela se existe próxima página sem pagar por um count(*).
        const rows = await this.prisma.$queryRaw<AcquisitionRow[]>(
          sensorAcquisitionsSql(serialNumber, range.from, range.to, pageSize + 1, (page - 1) * pageSize),
        );
        const hasNextPage = rows.length > pageSize;
        const pageRows = hasNextPage ? rows.slice(0, pageSize) : rows;

        let total: number | null = null;
        if (includeTotal) {
          const counted = await this.prisma.$queryRaw<Array<{ count: bigint }>>(
            sensorAcquisitionsCountSql(serialNumber, range.from, range.to),
          );
          total = Number(counted[0]?.count ?? 0);
        }

        return {
          serialNumber,
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          items: pageRows.map((row) => {
            const configuration = (row.configuration ?? {}) as Record<string, unknown>;
            const history = ((row.metadata ?? {}) as Record<string, unknown>).history as
              | Record<string, unknown>
              | undefined;
            const groundTruth = history?.groundTruth as Record<string, unknown> | undefined;
            const started = row.started_at?.getTime() ?? null;
            const ended = row.ended_at?.getTime() ?? null;

            return {
              cycleId: row.cycle_id,
              externalCycleId: row.external_cycle_id,
              startedAt: row.started_at?.toISOString() ?? null,
              endedAt: row.ended_at?.toISOString() ?? null,
              // +1 s: a última janela RMS cobre o segundo que ela inicia.
              durationSeconds: started !== null && ended !== null ? (ended - started) / 1000 + 1 : null,
              rpm: typeof configuration.rpm === 'number' ? configuration.rpm : null,
              loadPercent:
                typeof configuration.loadPercent === 'number' ? configuration.loadPercent : null,
              scenario: typeof configuration.scenario === 'string' ? configuration.scenario : null,
              sampleCount: row.sample_count,
              anchorSampleCount: Number(row.samples ?? 0),
              min: row.min,
              max: row.max,
              avg: row.avg,
              event: typeof groundTruth?.physicalEvent === 'string' ? groundTruth.physicalEvent : null,
              expectedState:
                typeof groundTruth?.expectedState === 'string' ? groundTruth.expectedState : null,
              unit: 'g',
            };
          }),
          page,
          pageSize,
          total,
          totalPages: total === null ? null : Math.ceil(total / pageSize),
          hasNextPage,
        };
      },
      (result) => result.items.length,
    );
  }

  /** Detalhe de uma aquisição: cabeçalho + resumo por série. Universo pequeno por natureza. */
  async acquisition(cycleId: string): Promise<AcquisitionDetailDto | null> {
    return this.measured(
      'analytics/acquisition',
      async () => {
        const cycle = await this.prisma.ingestionCycle.findUnique({ where: { id: cycleId } });
        if (!cycle) return null;

        const [seriesRows, sensor] = await Promise.all([
          this.prisma.$queryRaw<AcquisitionSeriesRow[]>(acquisitionSeriesSql(cycleId)),
          this.prisma.sensor.findUnique({
            where: { serialNumber: cycle.measuringSystemUid },
            include: { monitoringPoint: { include: { machine: true } } },
          }),
        ]);

        const configuration = (cycle.configuration ?? {}) as Record<string, unknown>;
        const history = ((cycle.metadata ?? {}) as Record<string, unknown>).history as
          | Record<string, unknown>
          | undefined;
        const starts = seriesRows.map((row) => row.started_at?.getTime()).filter((v): v is number => !!v);
        const ends = seriesRows.map((row) => row.ended_at?.getTime()).filter((v): v is number => !!v);
        const startedAt = starts.length ? new Date(Math.min(...starts)) : null;
        const endedAt = ends.length ? new Date(Math.max(...ends)) : null;

        return {
          cycleId: cycle.id,
          externalCycleId: cycle.cycleId,
          sensorSerialNumber: cycle.measuringSystemUid,
          sensorModel: sensor ? toDomainSensorModel(sensor.model) : null,
          machineName: sensor?.monitoringPoint?.machine.name ?? null,
          monitoringPointName: sensor?.monitoringPoint?.name ?? null,
          startedAt: startedAt?.toISOString() ?? null,
          endedAt: endedAt?.toISOString() ?? null,
          durationSeconds:
            startedAt && endedAt ? (endedAt.getTime() - startedAt.getTime()) / 1000 + 1 : null,
          rpm: typeof configuration.rpm === 'number' ? configuration.rpm : null,
          loadPercent: typeof configuration.loadPercent === 'number' ? configuration.loadPercent : null,
          scenario: typeof configuration.scenario === 'string' ? configuration.scenario : null,
          origin: cycle.origin,
          tags: cycle.tags,
          ingestedAt: cycle.createdAt.toISOString(),
          sampleCount: cycle.sampleCount,
          measurementCount: cycle.measurementCount,
          groundTruth: (history?.groundTruth as Record<string, unknown> | undefined) ?? null,
          series: seriesRows.map((row) => ({
            seriesId: row.series_id,
            physicalQuantity: toDomainPhysicalQuantity(row.physical_quantity),
            axis: toDomainAxis(row.axis),
            unit: row.unit,
            sampleCount: Number(row.samples),
            min: row.min,
            max: row.max,
            avg: row.avg,
            rms: row.rms,
            startedAt: row.started_at?.toISOString() ?? null,
            endedAt: row.ended_at?.toISOString() ?? null,
          })),
        };
      },
      (result) => result?.series.length ?? 0,
    );
  }

  /**
   * Resumo de um ATIVO na janela: cabeçalho, indicadores e uma linha por ponto.
   *
   * Reaproveita as consultas que já existem em vez de ganhar uma variante própria. Em
   * particular, a CLASSIFICAÇÃO vem da mesma `fleetConditionSql` do painel e é filtrada
   * depois: a escolha da aquisição de referência depende de quais sensores adquiriram
   * juntos, que é uma propriedade da FROTA — restringir a consulta a uma máquina poderia
   * eleger outra referência e fazer a mesma leitura aparecer com dois números diferentes
   * conforme a página. As agregações independentes por sensor (janela e tendência), essas
   * sim, são recortadas: dois sensores em vez de doze.
   */
  async machineSummary(
    machine: { id: string; name: string; type: 'PUMP' | 'FAN'; createdAt: Date; updatedAt: Date },
    range: TimeRange,
    options: { condition?: ConditionKind | null } = {},
    nowMs = Date.now(),
  ): Promise<MachineSummaryDto> {
    return this.measured(
      'analytics/machine-summary',
      async () => {
        const window = await this.evaluationWindow(range);
        const conditionRows = (
          await this.prisma.$queryRaw<FleetConditionRow[]>(fleetConditionSql(window.from, window.to))
        ).filter((row) => row.machine_id === machine.id);

        const serials = conditionRows
          .map((row) => row.sensor_serial)
          .filter((serial): serial is string => serial !== null);

        const source = await this.acquisitionSource(range, serials);
        const [windowRows, trend] = await Promise.all([
          serials.length === 0
            ? Promise.resolve([] as TimeWindowRow[])
            : this.prisma.$queryRaw<TimeWindowRow[]>(
                timeWindowSql(range.from, range.to, serials, source),
              ),
          serials.length === 0
            ? Promise.resolve(new Map<string, TrendPointDto[]>())
            : this.trendBySensor(window, serials),
        ]);
        const windowByPoint = new Map(windowRows.map((row) => [row.point_id, row]));

        const points: MachinePointSummaryDto[] = conditionRows.map((row) => {
          const window = windowByPoint.get(row.monitoring_point_id);
          const ratio = deviationRatio(row.current_rms, row.baseline_rms);
          return {
            monitoringPointId: row.monitoring_point_id,
            monitoringPointName: row.monitoring_point_name,
            slug: pointSlug(row.monitoring_point_name),
            sensorSerialNumber: row.sensor_serial,
            sensorModel: row.sensor_model ? toDomainSensorModel(row.sensor_model) : null,
            condition: classifyCondition(row.sensor_serial !== null, row.current_rms !== null, ratio),
            freshness: classifyFreshness(row.last_seen_at ?? row.current_at, nowMs),
            currentValue: row.current_rms,
            baselineValue: row.baseline_rms,
            deviationRatio: ratio,
            // Última leitura DA JANELA; sem leitura nela, a última conhecida do sensor —
            // é o que responde "quando esse ponto falou pela última vez".
            lastAt: (window?.last_at ?? row.last_seen_at)?.toISOString() ?? null,
            acquisitionCount: Number(window?.acquisitions ?? 0),
            sampleCount: Number(window?.samples ?? 0),
            min: window?.min ?? null,
            max: window?.max ?? null,
            avg: window?.avg ?? null,
            unit: 'g',
            trend: (row.sensor_serial && trend.get(row.sensor_serial)) || [],
          };
        });

        // Indicadores e contagens descrevem a MÁQUINA inteira; o filtro recorta só a lista.
        // Um seletor que muda o KPI ao lado dele responde a pergunta errada.
        const counts = countConditions(points.map((point) => point.condition));
        const condition = options.condition ?? null;
        const reporting = points.filter((point) => point.sampleCount > 0);
        const worst = points.reduce<MachinePointSummaryDto | null>(
          (best, point) =>
            point.deviationRatio !== null && (best?.deviationRatio ?? -Infinity) < point.deviationRatio
              ? point
              : best,
          null,
        );
        const lastAt = points.reduce<string | null>(
          (latest, point) =>
            point.lastAt && (!latest || point.lastAt > latest) ? point.lastAt : latest,
          null,
        );

        return {
          machineId: machine.id,
          machineName: machine.name,
          machineType: toDomainMachineType(machine.type) ?? 'Pump',
          slug: machineSlug(machine.name),
          createdAt: machine.createdAt.toISOString(),
          updatedAt: machine.updatedAt.toISOString(),
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          kpis: {
            points: points.length,
            sensors: serials.length,
            attention: points.filter(
              (point) => point.condition === 'attention' || point.condition === 'observation',
            ).length,
            acquisitionCount: points.reduce((sum, point) => sum + point.acquisitionCount, 0),
            coveragePercent:
              points.length === 0
                ? 0
                : Number(((reporting.length / points.length) * 100).toFixed(1)),
            maxDeviationRatio: worst?.deviationRatio ?? null,
            maxDeviationPoint: worst?.monitoringPointName ?? null,
          },
          lastAt,
          points: condition ? points.filter((point) => point.condition === condition) : points,
          counts,
          condition,
        };
      },
      (result) => result.points.length,
    );
  }

  /**
   * LISTAGEM OPERACIONAL DE MÁQUINAS — recorte, ordenação e paginação no servidor.
   *
   * Existe porque a listagem precisa responder "quais ativos estão em atenção", e condição
   * é derivada: não há coluna para filtrar. Em vez de baixar tudo e filtrar no navegador —
   * que é exatamente o padrão que este projeto passou a rodada anterior removendo —, a
   * mesma `fleetConditionSql` do painel classifica, e o recorte acontece aqui.
   *
   * Ordenar e paginar em memória é honesto NESTA tabela: a planta tem unidades de máquinas,
   * e o custo não cresce com o histórico. O que nunca pode ser ordenado em memória é
   * amostra — e amostra não passa por aqui.
   */
  async machineList(
    range: TimeRange,
    options: {
      condition?: ConditionKind | null;
      search?: string | null;
      page: number;
      pageSize: number;
      sortBy: MachineListSortColumn;
      sortDir: 'asc' | 'desc';
    },
  ): Promise<MachineListResponseDto> {
    return this.measured(
      'analytics/machine-list',
      async () => {
        const window = await this.evaluationWindow(range);
        const [machines, conditionRows] = await Promise.all([
          this.prisma.machine.findMany({
            select: {
              id: true,
              name: true,
              type: true,
              _count: { select: { monitoringPoints: true } },
            },
          }),
          this.prisma.$queryRaw<FleetConditionRow[]>(fleetConditionSql(window.from, window.to)),
        ]);

        const byMachine = new Map<string, FleetConditionRow[]>();
        for (const row of conditionRows) {
          byMachine.set(row.machine_id, [...(byMachine.get(row.machine_id) ?? []), row]);
        }

        const all: MachineListItemDto[] = machines.map((machine) => {
          const rows = byMachine.get(machine.id) ?? [];
          const classified = rows.map((row) =>
            classifyCondition(row.sensor_serial !== null, row.current_rms !== null, deviationRatio(row.current_rms, row.baseline_rms)),
          );
          const worst = rows.reduce<{ ratio: number; point: string } | null>((best, row) => {
            const ratio = deviationRatio(row.current_rms, row.baseline_rms);
            return ratio !== null && (best === null || ratio > best.ratio)
              ? { ratio, point: row.monitoring_point_name }
              : best;
          }, null);
          const lastAt = rows.reduce<Date | null>((latest, row) => {
            const at = row.last_seen_at ?? row.current_at;
            return at && (!latest || at > latest) ? at : latest;
          }, null);

          return {
            machineId: machine.id,
            machineName: machine.name,
            machineType: toDomainMachineType(machine.type) ?? 'Pump',
            slug: machineSlug(machine.name),
            pointCount: machine._count.monitoringPoints,
            sensorCount: rows.filter((row) => row.sensor_serial !== null).length,
            attentionCount: classified.filter(
              (kind) => kind === 'attention' || kind === 'observation',
            ).length,
            // Máquina sem ponto algum não tem condição a mostrar: "sem sensor" é o estado
            // honesto, e é o que o vocabulário do domínio já diz.
            condition: worstCondition(classified) ?? 'no-sensor',
            lastAt: lastAt?.toISOString() ?? null,
            maxDeviationRatio: worst?.ratio ?? null,
            maxDeviationPoint: worst?.point ?? null,
          };
        });

        const counts = countConditions(all.map((item) => item.condition));
        const search = options.search ?? null;
        const wanted = search ? naturalKey(search) : null;
        const filtered = all.filter(
          (item) =>
            (options.condition ? item.condition === options.condition : true) &&
            (wanted ? naturalKey(item.machineName).includes(wanted) : true),
        );

        const direction = options.sortDir === 'desc' ? -1 : 1;
        const sorted = [...filtered].sort((a, b) => {
          switch (options.sortBy) {
            case 'condition':
              return (
                (CONDITION_SEVERITY[a.condition] - CONDITION_SEVERITY[b.condition]) * direction ||
                a.machineName.localeCompare(b.machineName, 'pt-BR')
              );
            case 'deviation':
              return (
                ((a.maxDeviationRatio ?? -Infinity) - (b.maxDeviationRatio ?? -Infinity)) * direction ||
                a.machineName.localeCompare(b.machineName, 'pt-BR')
              );
            case 'lastAt':
              return (
                ((a.lastAt ?? '') < (b.lastAt ?? '') ? -1 : (a.lastAt ?? '') > (b.lastAt ?? '') ? 1 : 0) *
                  direction || a.machineName.localeCompare(b.machineName, 'pt-BR')
              );
            default:
              return a.machineName.localeCompare(b.machineName, 'pt-BR') * direction;
          }
        });

        const start = (options.page - 1) * options.pageSize;
        return {
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          items: sorted.slice(start, start + options.pageSize),
          total: sorted.length,
          page: options.page,
          pageSize: options.pageSize,
          totalPages: Math.max(1, Math.ceil(sorted.length / options.pageSize)),
          counts,
          condition: options.condition ?? null,
          search,
          sortBy: options.sortBy,
          sortDir: options.sortDir,
        };
      },
      (result) => result.items.length,
    );
  }

  /**
   * Resumo de um PONTO: o contexto entre o ativo e o sensor.
   *
   * Deliberadamente mais raso que a página do sensor — condição, disponibilidade e as
   * séries existentes. Quem quer a história de trinta dias desce mais um nível.
   */
  async pointSummary(
    machine: { id: string; name: string; type: 'PUMP' | 'FAN' },
    point: { id: string; name: string },
    range: TimeRange,
    nowMs = Date.now(),
  ): Promise<PointSummaryDto> {
    return this.measured(
      'analytics/point-summary',
      async () => {
        const evalWindow = await this.evaluationWindow(range);
        const row =
          (
            await this.prisma.$queryRaw<FleetConditionRow[]>(
              fleetConditionSql(evalWindow.from, evalWindow.to),
            )
          ).find((candidate) => candidate.monitoring_point_id === point.id) ?? null;

        const serial = row?.sensor_serial ?? null;
        const source = await this.acquisitionSource(range, serial === null ? [] : [serial]);
        const [windowRows, trend, seriesRows] = await Promise.all([
          serial === null
            ? Promise.resolve([] as TimeWindowRow[])
            : this.prisma.$queryRaw<TimeWindowRow[]>(timeWindowSql(range.from, range.to, [serial], source)),
          serial === null
            ? Promise.resolve(new Map<string, TrendPointDto[]>())
            : this.trendBySensor(evalWindow, [serial]),
          serial === null
            ? Promise.resolve([] as PointSeriesRow[])
            : this.prisma.$queryRaw<PointSeriesRow[]>(
                pointSeriesSql(serial, range.from, range.to),
              ),
        ]);

        const window = windowRows[0] ?? null;
        const ratio = deviationRatio(row?.current_rms ?? null, row?.baseline_rms ?? null);

        return {
          machineId: machine.id,
          machineName: machine.name,
          machineType: toDomainMachineType(machine.type) ?? 'Pump',
          machineSlug: machineSlug(machine.name),
          monitoringPointId: point.id,
          monitoringPointName: point.name,
          slug: pointSlug(point.name),
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          sensorSerialNumber: serial,
          sensorModel: row?.sensor_model ? toDomainSensorModel(row.sensor_model) : null,
          condition: classifyCondition(serial !== null, (row?.current_rms ?? null) !== null, ratio),
          freshness: classifyFreshness(row?.last_seen_at ?? row?.current_at ?? null, nowMs),
          currentValue: row?.current_rms ?? null,
          baselineValue: row?.baseline_rms ?? null,
          deviationRatio: ratio,
          currentAt: row?.current_at?.toISOString() ?? null,
          baselineAt: row?.baseline_at?.toISOString() ?? null,
          currentCycleId: row?.current_cycle_id ?? null,
          baselineCycleId: row?.baseline_cycle_id ?? null,
          unit: 'g',
          window: {
            acquisitionCount: Number(window?.acquisitions ?? 0),
            sampleCount: Number(window?.samples ?? 0),
            min: window?.min ?? null,
            max: window?.max ?? null,
            avg: window?.avg ?? null,
            lastValue: window?.last_value ?? null,
            lastAt: (window?.last_at ?? row?.last_seen_at)?.toISOString() ?? null,
          },
          trend: (serial && trend.get(serial)) || [],
          series: seriesRows.map((series) => ({
            seriesId: series.series_id,
            physicalQuantity: toDomainPhysicalQuantity(series.physical_quantity),
            axis: toDomainAxis(series.axis),
            unit: series.unit,
            lastValue: series.last_value,
            lastAt: series.last_at?.toISOString() ?? null,
          })),
        };
      },
      (result) => result.series.length,
    );
  }

  /**
   * Amostras brutas de UMA aquisição, por keyset. É o nível folha da investigação: o
   * único ponto do sistema que devolve telemetria crua, e ainda assim recortada.
   */
  async acquisitionSamples(
    cycleId: string,
    limit: number,
    cursor: string | null,
    filters: { quantity: string | null; axis: string | null },
  ): Promise<RawSamplePageDto> {
    return this.measured(
      'analytics/acquisition-samples',
      async () => {
        const decoded = decodeCursor(cursor);
        const rows = await this.prisma.$queryRaw<RawSampleRow[]>(
          acquisitionSamplesSql(cycleId, limit + 1, decoded, filters),
        );
        const hasNext = rows.length > limit;
        const pageRows = hasNext ? rows.slice(0, limit) : rows;
        const last = pageRows.at(-1);

        return {
          cycleId,
          items: pageRows.map((row) => ({
            id: row.id,
            timestamp: row.timestamp.toISOString(),
            value: row.value,
            physicalQuantity: toDomainPhysicalQuantity(row.physical_quantity),
            axis: toDomainAxis(row.axis),
            unit: row.unit,
          })),
          limit,
          nextCursor: hasNext && last ? encodeCursor(last.timestamp, last.id) : null,
          quantity: filters.quantity,
          axis: filters.axis,
        };
      },
      (result) => result.items.length,
    );
  }
}
