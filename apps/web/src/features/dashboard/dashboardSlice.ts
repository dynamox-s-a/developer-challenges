import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  AlertListResponseDto,
  FleetConditionResponseDto,
  HeatmapResponseDto,
  SeriesPointsResponseDto,
  TimeSeriesSampleDto,
  TimeSeriesSummary,
} from '@dynamox/domain';

import {
  api,
  type AnalyticsRange,
  type MachineDto,
  type MonitoringPointDto,
} from '../../api/client';
import type { RequestStatus } from '../../store/requestStatus';

/**
 * Períodos da tendência. `all` existe para que a tela NUNCA fique sem resposta quando o
 * histórico está fora da janela escolhida: o estado vazio oferece "ver período disponível"
 * em vez de só informar que não há dados.
 */
export type DashboardPeriod = '24h' | '7d' | '30d' | 'all';

export interface ResourceState<T> {
  status: RequestStatus;
  data: T;
  error: string | null;
}

export interface DashboardState {
  machines: ResourceState<MachineDto[]>;
  points: ResourceState<MonitoringPointDto[]>;
  series: ResourceState<TimeSeriesSummary[]>;
  /** Avaliação de condição (segunda etapa, fora do caminho crítico do primeiro render). */
  conditionStatus: RequestStatus;
  /**
   * Condição calculada pelo servidor. Substituiu o download das séries radiais inteiras:
   * a mesma classificação chega em uma requisição de poucos KB.
   */
  fleetCondition: FleetConditionResponseDto | null;
  conditionError: string | null;
  /** Mapa de atividade da janela, agregado no servidor. */
  heatmap: HeatmapResponseDto | null;
  heatmapStatus: RequestStatus;
  heatmapError: string | null;
  /**
   * Alertas persistidos: as contagens do universo (KPI) e os últimos episódios por
   * evidência (feed). Uma requisição serve aos dois — `counts` já descreve tudo.
   */
  alerts: AlertListResponseDto | null;
  alertsStatus: RequestStatus;
  alertsError: string | null;
  /**
   * Amostras radiais cruas. Continua existindo para o caminho de cálculo local (testes e
   * cenários sem o endpoint analítico); em produção o painel não as baixa mais.
   */
  radialSamplesBySeries: Record<string, TimeSeriesSampleDto[]>;
  radialSampleErrors: Record<string, string>;
  period: DashboardPeriod;
  selectedSeriesId: string | null;
  /**
   * Quem escolheu a série exibida. Uma seleção automática pode ser substituída quando a
   * avaliação de condição chega e revela a exceção; a escolha da pessoa, não.
   */
  selectionSource: 'auto' | 'user';
  detailStatus: RequestStatus;
  /** Série da tendência já agregada por bucket — nunca as amostras da janela inteira. */
  detailPoints: SeriesPointsResponseDto | null;
  detailError: string | null;
  activeDetailRequestId: string | null;
  loadedAt: string | null;
}

const emptyResource = <T,>(data: T): ResourceState<T> => ({
  status: 'idle',
  data,
  error: null,
});

export const initialDashboardState: DashboardState = {
  machines: emptyResource([]),
  points: emptyResource([]),
  series: emptyResource([]),
  conditionStatus: 'idle',
  fleetCondition: null,
  conditionError: null,
  heatmap: null,
  heatmapStatus: 'idle',
  heatmapError: null,
  alerts: null,
  alertsStatus: 'idle',
  alertsError: null,
  radialSamplesBySeries: {},
  radialSampleErrors: {},
  period: '7d',
  selectedSeriesId: null,
  selectionSource: 'auto',
  detailStatus: 'idle',
  detailPoints: null,
  detailError: null,
  activeDetailRequestId: null,
  loadedAt: null,
};

interface ResourceResult<T> {
  data: T;
  error: string | null;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Erro desconhecido.';
}

function fromSettled<T>(result: PromiseSettledResult<T>, fallback: T): ResourceResult<T> {
  return result.status === 'fulfilled'
    ? { data: result.value, error: null }
    : { data: fallback, error: messageOf(result.reason) };
}

export interface OperationalDashboardPayload {
  machines: ResourceResult<MachineDto[]>;
  points: ResourceResult<MonitoringPointDto[]>;
  series: ResourceResult<TimeSeriesSummary[]>;
  loadedAt: string;
}

/** Janela consultada pelo painel, derivada do período selecionado. */
export function rangeForPeriod(period: DashboardPeriod, nowMs: number): AnalyticsRange {
  const spans: Record<DashboardPeriod, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    // "Tudo" ainda é uma janela: o servidor recusa consulta sem recorte, e 90 dias é o teto.
    all: 90 * 24 * 60 * 60 * 1000,
  };
  const to = new Date(nowMs);
  return { from: new Date(nowMs - spans[period]).toISOString(), to: to.toISOString() };
}

/** Folga somada à âncora para a última leitura cair DENTRO da janela consultada. */
const ANCHOR_SLACK_MS = 60_000;

/** Instante da leitura mais recente conhecida, a partir do resumo das séries. */
export function dataAnchorMs(series: TimeSeriesSummary[]): number | null {
  let max = Number.NEGATIVE_INFINITY;
  for (const item of series) {
    const at = item.lastTimestamp ? Date.parse(item.lastTimestamp) : Number.NaN;
    if (Number.isFinite(at) && at > max) max = at;
  }
  return Number.isFinite(max) ? max : null;
}

/**
 * Janela do período ANCORADA NA ÚLTIMA LEITURA, não no relógio da máquina.
 *
 * Numa operação viva as duas âncoras quase coincidem. Quando a ingestão para — fim da
 * demonstração, planta parada, gateway fora — ancorar em `Date.now()` faz o painel
 * apodrecer sozinho: a baseline da condição usa as últimas 24 h DA JANELA, então primeiro
 * a referência desliza para fora (tudo vira "sem classificação"), depois a própria leitura.
 * "Últimos 7 dias" aqui significa os últimos 7 dias DE DADO; a recência contra o relógio
 * continua sendo dita, com contexto, pelos painéis de recência e pelos alertas de telemetria.
 */
export function anchoredRangeForPeriod(
  period: DashboardPeriod,
  series: TimeSeriesSummary[],
  nowMs: number,
): AnalyticsRange {
  const anchor = dataAnchorMs(series);
  return rangeForPeriod(period, anchor === null ? nowMs : anchor + ANCHOR_SLACK_MS);
}

/** Bucket proporcional ao período: quanto maior a janela, mais grossa a agregação. */
export function bucketForPeriod(period: DashboardPeriod): string {
  if (period === '24h') return '15m';
  if (period === '7d') return '1h';
  return '4h';
}

/**
 * PRIMEIRA ETAPA — inventário. Três requisições, independentes entre si: `allSettled`
 * mantém o painel utilizável quando uma delas falha.
 *
 * O resumo das séries já traz a última leitura de cada uma (valor e instante), então esta
 * etapa desenha a matriz inteira sem uma chamada por série — o padrão anterior custava
 * dezenas de requisições antes do primeiro render.
 */
export const fetchOperationalDashboard = createAsyncThunk(
  'dashboard/fetchOperationalDashboard',
  async (): Promise<OperationalDashboardPayload> => {
    const [machinesSettled, pointsSettled, seriesSettled] = await Promise.allSettled([
      api.machines(),
      api.allMonitoringPoints(),
      api.timeSeries(),
    ]);

    return {
      machines: fromSettled(machinesSettled, []),
      points: fromSettled(pointsSettled, []),
      series: fromSettled(seriesSettled, []),
      loadedAt: new Date().toISOString(),
    };
  },
);

/**
 * SEGUNDA ETAPA — condição, calculada no servidor.
 *
 * Antes: baixar as séries radiais inteiras (5.000 amostras por página, sequencial) e
 * classificar no browser — com histórico de 30 dias isso passava de 800 requisições e
 * centenas de MB. Agora uma consulta agregada devolve a mesma classificação em poucos KB.
 */
export const fetchFleetCondition = createAsyncThunk<
  FleetConditionResponseDto,
  void,
  { state: { dashboard: DashboardState } }
>('dashboard/fetchFleetCondition', async (_, { getState }) => {
  const { period, series } = getState().dashboard;
  // A tendência curta vem junto: são doze valores por ponto, agregados no banco, e é o
  // que devolve as miniaturas da fila de inspeção sem reabrir a porta das amostras brutas.
  return api.fleetCondition(anchoredRangeForPeriod(period, series.data, Date.now()), { includeTrend: true });
});

/** Mapa de atividade da janela — uma consulta agregada, nunca as amostras do período. */
export const fetchActivityHeatmap = createAsyncThunk<
  HeatmapResponseDto,
  void,
  { state: { dashboard: DashboardState } }
>('dashboard/fetchActivityHeatmap', async (_, { getState }) => {
  const { period, series } = getState().dashboard;
  return api.heatmap(anchoredRangeForPeriod(period, series.data, Date.now()), 'hour');
});

/**
 * Resumo de alertas para o painel: os seis episódios com evidência mais recente (ativos ou
 * não) e as contagens do universo. Alerta tem o próprio tempo — não recebe a janela do
 * painel: o KPI responde "o que está aberto agora", não "o que abriu nesta semana".
 */
export const fetchAlertsSummary = createAsyncThunk<AlertListResponseDto, void>(
  'dashboard/fetchAlertsSummary',
  async () => api.alerts({ pageSize: 6, sortBy: 'lastEvaluatedAt', sortDir: 'desc' }),
);

/**
 * Detalhe da série selecionada, JÁ AGREGADO por bucket. O gráfico precisa de um formato
 * temporal, não de todas as amostras: 30 dias de uma série são ~170 mil amostras e ~175
 * pontos depois da agregação no banco.
 */
export const fetchDashboardSeriesDetail = createAsyncThunk<
  { seriesId: string; points: SeriesPointsResponseDto },
  string,
  { state: { dashboard: DashboardState } }
>('dashboard/fetchSeriesDetail', async (seriesId: string, { getState }) => {
  const { period, series } = getState().dashboard;
  const points = await api.seriesPoints(
    seriesId,
    anchoredRangeForPeriod(period, series.data, Date.now()),
    bucketForPeriod(period),
  );
  return { seriesId, points };
});

/** Ter leitura vale mais que ter contagem: `lastTimestamp` responde sem custo de count(*). */
function preferredSeries(series: TimeSeriesSummary[]): string | null {
  const hasData = (item: TimeSeriesSummary) => item.lastTimestamp !== null;
  return (
    series.find(
      (item) => hasData(item) && item.physicalQuantity === 'acceleration' && item.axis === 'y',
    ) ??
    series.find(hasData) ??
    series[0] ??
    null
  )?.id ?? null;
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialDashboardState,
  reducers: {
    periodChanged(state, action: PayloadAction<DashboardPeriod>) {
      state.period = action.payload;
    },
    /** Seleção automática: só troca enquanto a pessoa não escolheu nada. */
    dashboardSeriesAutoSelected(state, action: PayloadAction<string>) {
      if (state.selectionSource === 'user' || state.selectedSeriesId === action.payload) return;
      state.selectedSeriesId = action.payload;
      state.activeDetailRequestId = null;
      state.detailPoints = null;
      state.detailError = null;
      state.detailStatus = 'loading';
    },
    dashboardSeriesSelected(state, action: PayloadAction<string | null>) {
      state.selectionSource = 'user';
      if (state.selectedSeriesId === action.payload) return;
      state.selectedSeriesId = action.payload;
      state.activeDetailRequestId = null;
      state.detailPoints = null;
      state.detailError = null;
      state.detailStatus = action.payload ? 'loading' : 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperationalDashboard.pending, (state) => {
        for (const resource of [state.machines, state.points, state.series]) {
          resource.status = 'loading';
          resource.error = null;
        }
      })
      .addCase(fetchOperationalDashboard.fulfilled, (state, action) => {
        const apply = <T,>(target: ResourceState<T>, result: ResourceResult<T>) => {
          target.status = result.error ? 'failed' : 'succeeded';
          target.data = result.data;
          target.error = result.error;
        };
        apply(state.machines, action.payload.machines);
        apply(state.points, action.payload.points);
        apply(state.series, action.payload.series);
        state.loadedAt = action.payload.loadedAt;

        const selectionStillExists = action.payload.series.data.some(
          (item) => item.id === state.selectedSeriesId,
        );
        if (!selectionStillExists) {
          state.selectedSeriesId = preferredSeries(action.payload.series.data);
          state.detailPoints = null;
          state.detailError = null;
          state.detailStatus = state.selectedSeriesId ? 'loading' : 'idle';
          state.activeDetailRequestId = null;
        }
      })
      .addCase(fetchOperationalDashboard.rejected, (state, action) => {
        const message = action.error.message ?? 'Não foi possível carregar o dashboard.';
        for (const resource of [state.machines, state.points, state.series]) {
          resource.status = 'failed';
          resource.error = message;
        }
        state.conditionStatus = 'failed';
      })
      .addCase(fetchFleetCondition.pending, (state) => {
        state.conditionStatus = 'loading';
        state.conditionError = null;
      })
      .addCase(fetchFleetCondition.fulfilled, (state, action) => {
        state.conditionStatus = 'succeeded';
        state.fleetCondition = action.payload;
      })
      .addCase(fetchFleetCondition.rejected, (state, action) => {
        state.conditionStatus = 'failed';
        state.conditionError = action.error.message ?? 'Não foi possível avaliar a condição.';
      })
      .addCase(fetchAlertsSummary.pending, (state) => {
        state.alertsStatus = 'loading';
        state.alertsError = null;
      })
      .addCase(fetchAlertsSummary.fulfilled, (state, action) => {
        state.alertsStatus = 'succeeded';
        state.alerts = action.payload;
      })
      .addCase(fetchAlertsSummary.rejected, (state, action) => {
        state.alertsStatus = 'failed';
        state.alertsError = action.error.message ?? 'Não foi possível consultar os alertas.';
      })
      .addCase(fetchActivityHeatmap.pending, (state) => {
        state.heatmapStatus = 'loading';
        state.heatmapError = null;
      })
      .addCase(fetchActivityHeatmap.fulfilled, (state, action) => {
        state.heatmapStatus = 'succeeded';
        state.heatmap = action.payload;
      })
      .addCase(fetchActivityHeatmap.rejected, (state, action) => {
        state.heatmapStatus = 'failed';
        state.heatmapError = action.error.message ?? 'Não foi possível carregar o mapa.';
      })
      .addCase(fetchDashboardSeriesDetail.pending, (state, action) => {
        state.activeDetailRequestId = action.meta.requestId;
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchDashboardSeriesDetail.fulfilled, (state, action) => {
        if (
          state.activeDetailRequestId !== action.meta.requestId ||
          state.selectedSeriesId !== action.payload.seriesId
        ) {
          return;
        }
        state.detailStatus = 'succeeded';
        // O painel consome a resposta do servidor como ela é — sem reconstruir "amostras".
        state.detailPoints = action.payload.points;
      })
      .addCase(fetchDashboardSeriesDetail.rejected, (state, action) => {
        if (
          state.activeDetailRequestId !== action.meta.requestId ||
          state.selectedSeriesId !== action.meta.arg
        ) {
          return;
        }
        state.detailStatus = 'failed';
        state.detailPoints = null;
        state.detailError = action.error.message ?? 'Não foi possível carregar as amostras.';
      });
  },
});

export const { dashboardSeriesAutoSelected, dashboardSeriesSelected, periodChanged } =
  dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
