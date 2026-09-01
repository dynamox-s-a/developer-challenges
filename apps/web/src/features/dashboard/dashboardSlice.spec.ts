import { describe, expect, it } from 'vitest';

import { EMPTY_CONDITION_COUNTS } from '@dynamox/domain';
import type { FleetConditionResponseDto, SeriesPointsResponseDto } from '@dynamox/domain';
import type { TimeSeriesSummary } from '@dynamox/domain';

import {
  bucketForPeriod,
  dashboardReducer,
  dashboardSeriesSelected,
  fetchDashboardSeriesDetail,
  fetchFleetCondition,
  fetchOperationalDashboard,
  initialDashboardState,
  periodChanged,
  rangeForPeriod,
  type OperationalDashboardPayload,
} from './dashboardSlice';

const xSeries: TimeSeriesSummary = {
  id: 'series-x',
  sensorSerialNumber: 'SIM-HF-001',
  sensorModel: 'HF+',
  machineName: 'P-101',
  machineType: 'Pump',
  monitoringPointName: 'DE',
  physicalQuantity: 'acceleration',
  axis: 'x',
  unit: 'g',
  displayName: null,
  sampleCount: 10,
  lastValue: 0.008,
  lastTimestamp: '2026-08-29T11:59:00.000Z',
};

const ySeries: TimeSeriesSummary = { ...xSeries, id: 'series-y', axis: 'y' };

function conditionPayload(
  overrides: Partial<FleetConditionResponseDto['points'][number]> = {},
): FleetConditionResponseDto {
  return {
    from: '2026-08-22T12:00:00.000Z',
    to: '2026-08-29T12:00:00.000Z',
    generatedAt: '2026-08-29T12:00:00.000Z',
    counts: { ...EMPTY_CONDITION_COUNTS, total: 1, attention: 1 },
    condition: null,
    points: [
      {
        machineName: 'P-101',
        machineType: 'Pump',
        monitoringPointId: 'point-1',
        monitoringPointName: 'Mancal lado oposto ao acoplamento',
        sensorSerialNumber: 'SIM-HF-002',
        sensorModel: 'HF+',
        condition: 'attention',
        freshness: 'current',
        currentValue: 0.0572,
        baselineValue: 0.0164,
        deviationRatio: 3.49,
        currentAt: '2026-08-29T11:00:59.000Z',
        baselineAt: '2026-08-29T10:00:00.000Z',
        currentSampleCount: 60,
        trend: [],
        currentCycleId: 'cycle-current',
        baselineCycleId: 'cycle-baseline',
        unit: 'g',
        ...overrides,
      },
    ],
  };
}

function pointsPayload(): SeriesPointsResponseDto {
  return {
    seriesId: 'series-y',
    from: '2026-08-22T12:00:00.000Z',
    to: '2026-08-29T12:00:00.000Z',
    bucket: '1h',
    stats: {
      sampleCount: 180,
      acquisitionCount: 3,
      min: 0.01,
      max: 0.06,
      avg: 0.03,
      firstAt: '2026-08-29T09:00:00.000Z',
      lastAt: '2026-08-29T11:00:59.000Z',
    },
    points: [
      { bucketStart: '2026-08-29T10:00:00.000Z', sampleCount: 60, acquisitionCount: 1, avg: 2, min: 1, max: 3, lastAt: '2026-08-29T10:00:59.000Z' },
    ],
  };
}

function payload(overrides: Partial<OperationalDashboardPayload> = {}): OperationalDashboardPayload {
  return {
    machines: { data: [], error: null },
    points: { data: [], error: null },
    series: { data: [xSeries, ySeries], error: null },
    loadedAt: '2026-08-29T12:00:00.000Z',
    ...overrides,
  };
}

describe('dashboardSlice', () => {
  it('usa 7 dias como período padrão e permite trocar o filtro global', () => {
    expect(initialDashboardState.period).toBe('7d');
    expect(dashboardReducer(initialDashboardState, periodChanged('24h')).period).toBe('24h');
    expect(dashboardReducer(initialDashboardState, periodChanged('30d')).period).toBe('30d');
  });

  it('marca o inventário como loading no carregamento inicial', () => {
    const state = dashboardReducer(
      initialDashboardState,
      fetchOperationalDashboard.pending('load-1'),
    );
    expect(state.machines.status).toBe('loading');
    expect(state.points.status).toBe('loading');
    expect(state.series.status).toBe('loading');
    // A avaliação de condição é uma segunda etapa: não bloqueia o primeiro render.
    expect(state.conditionStatus).toBe('idle');
  });

  it('seleciona primeiro a aceleração Y com amostras', () => {
    const state = dashboardReducer(
      initialDashboardState,
      fetchOperationalDashboard.fulfilled(payload(), 'load-2'),
    );
    expect(state.selectedSeriesId).toBe('series-y');
    expect(state.detailStatus).toBe('loading');
  });

  it('preserva a seleção se a série continuar no catálogo recarregado', () => {
    const selected = dashboardReducer(initialDashboardState, dashboardSeriesSelected('series-x'));
    const state = dashboardReducer(
      selected,
      fetchOperationalDashboard.fulfilled(payload(), 'load-3'),
    );
    expect(state.selectedSeriesId).toBe('series-x');
  });

  it('isola erro parcial de pontos sem apagar séries disponíveis', () => {
    const state = dashboardReducer(
      initialDashboardState,
      fetchOperationalDashboard.fulfilled(
        payload({ points: { data: [], error: 'Pontos indisponíveis' } }),
        'load-4',
      ),
    );
    expect(state.points).toMatchObject({ status: 'failed', error: 'Pontos indisponíveis' });
    expect(state.series.status).toBe('succeeded');
    expect(state.series.data).toHaveLength(2);
  });

  it('guarda a condição avaliada pelo servidor e reporta falha da avaliação', () => {
    const avaliado = dashboardReducer(
      initialDashboardState,
      fetchFleetCondition.fulfilled(conditionPayload(), 'cond-1', undefined),
    );
    expect(avaliado.conditionStatus).toBe('succeeded');
    expect(avaliado.fleetCondition?.points[0]).toMatchObject({
      sensorSerialNumber: 'SIM-HF-002',
      condition: 'attention',
      deviationRatio: 3.49,
    });

    const falhou = dashboardReducer(
      initialDashboardState,
      fetchFleetCondition.rejected(new Error('Avaliação indisponível'), 'cond-2', undefined),
    );
    expect(falhou.conditionStatus).toBe('failed');
    expect(falhou.conditionError).toBe('Avaliação indisponível');
  });

  it('a carga inicial não traz amostras: a condição é a segunda etapa, e vem agregada', () => {
    const state = dashboardReducer(
      initialDashboardState,
      fetchOperationalDashboard.fulfilled(payload(), 'load-5b'),
    );
    expect(state.radialSamplesBySeries).toEqual({});
    expect(state.fleetCondition).toBeNull();
    expect(state.conditionStatus).toBe('idle');

    const avaliado = dashboardReducer(
      state,
      fetchFleetCondition.fulfilled(conditionPayload(), 'cond-2', undefined),
    );
    expect(avaliado.conditionStatus).toBe('succeeded');
    // O painel nunca mais acumula amostra bruta para classificar.
    expect(avaliado.radialSamplesBySeries).toEqual({});
  });

  it('a janela e o bucket da consulta vêm do período — nunca "tudo o que existe"', () => {
    const nowMs = Date.parse('2026-08-29T12:00:00.000Z');
    expect(rangeForPeriod('24h', nowMs)).toEqual({
      from: '2026-08-28T12:00:00.000Z',
      to: '2026-08-29T12:00:00.000Z',
    });
    expect(rangeForPeriod('7d', nowMs).from).toBe('2026-08-22T12:00:00.000Z');
    expect(rangeForPeriod('30d', nowMs).from).toBe('2026-07-30T12:00:00.000Z');
    // "Tudo" também é recortado: o servidor recusa consulta analítica sem janela.
    expect(rangeForPeriod('all', nowMs).from).toBe('2026-05-31T12:00:00.000Z');

    // Quanto maior a janela, mais grossa a agregação — o gráfico recebe pontos, não amostras.
    expect(bucketForPeriod('24h')).toBe('15m');
    expect(bucketForPeriod('7d')).toBe('1h');
    expect(bucketForPeriod('30d')).toBe('4h');
    expect(bucketForPeriod('all')).toBe('4h');
  });

  it('descarta resposta atrasada da série anterior', () => {
    let state = dashboardReducer(initialDashboardState, dashboardSeriesSelected('series-x'));
    state = dashboardReducer(state, fetchDashboardSeriesDetail.pending('detail-x', 'series-x'));
    state = dashboardReducer(state, dashboardSeriesSelected('series-y'));
    state = dashboardReducer(state, fetchDashboardSeriesDetail.pending('detail-y', 'series-y'));
    state = dashboardReducer(
      state,
      fetchDashboardSeriesDetail.fulfilled(
        { seriesId: 'series-y', points: pointsPayload() },
        'detail-y',
        'series-y',
      ),
    );
    state = dashboardReducer(
      state,
      fetchDashboardSeriesDetail.fulfilled(
        {
          seriesId: 'series-x',
          points: { ...pointsPayload(), seriesId: 'series-x', points: [{ bucketStart: '2026-08-29T10:00:00.000Z', sampleCount: 60, acquisitionCount: 1, avg: 9, min: 9, max: 9, lastAt: null }] },
        },
        'detail-x',
        'series-x',
      ),
    );
    expect(state.selectedSeriesId).toBe('series-y');
    // A resposta do servidor entra como é: um ponto por bucket, nenhuma amostra bruta.
    expect(state.detailPoints?.points[0].avg).toBe(2);
    expect(state.detailPoints?.stats.sampleCount).toBe(180);
  });

  it('mostra erro do detalhe somente para a requisição ainda ativa', () => {
    let state = dashboardReducer(initialDashboardState, dashboardSeriesSelected('series-y'));
    state = dashboardReducer(state, fetchDashboardSeriesDetail.pending('detail-y', 'series-y'));
    state = dashboardReducer(
      state,
      fetchDashboardSeriesDetail.rejected(new Error('Série indisponível'), 'detail-y', 'series-y'),
    );
    expect(state.detailStatus).toBe('failed');
    expect(state.detailError).toBe('Série indisponível');
    expect(state.detailPoints).toBeNull();
  });

  it('marca todos os recursos como falhos numa rejeição inesperada do thunk', () => {
    const state = dashboardReducer(
      initialDashboardState,
      fetchOperationalDashboard.rejected(new Error('Falha geral'), 'load-6'),
    );
    expect(state.machines.status).toBe('failed');
    expect(state.points.status).toBe('failed');
    expect(state.series.status).toBe('failed');
    expect(state.machines.error).toBe('Falha geral');
  });
});
