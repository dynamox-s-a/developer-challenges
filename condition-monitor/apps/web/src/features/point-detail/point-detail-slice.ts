import type {
  Forecast,
  MonitoringPoint,
  ReadingsAnswer,
  SeriesMetrics,
  TimeRangeQuery,
  TimeSeriesSummary,
} from '@condition-monitor/shared';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { deleteJson, getJson } from '../../api/http';
import type { LoadStatus } from '../sectors/sectors-slice';

/**
 * Points a chart asks for per series. Above it the API answers buckets of minimum and
 * maximum (ADR 0009): about one per pixel of a wide chart, more would not be seen.
 */
export const MAX_CHART_POINTS = 1_000;

export const PERIODS = [
  { key: 'day', label: 'Last 24 h', hours: 24 },
  { key: 'week', label: 'Last 7 days', hours: 24 * 7 },
  { key: 'month', label: 'Last 30 days', hours: 24 * 30 },
  { key: 'all', label: 'All', hours: null },
] as const;

export type Period = (typeof PERIODS)[number]['key'];

/**
 * The interval of a period. It ends at the point's latest reading, not at the current
 * time: data imported from last month would otherwise show an empty "last 24 h".
 */
export function rangeOf(period: Period, series: TimeSeriesSummary[]): TimeRangeQuery {
  const hours = PERIODS.find((item) => item.key === period)?.hours ?? null;
  // ISO instants in UTC sort as text in time order.
  const ends = series
    .map((item) => item.lastTimestamp)
    .filter((value): value is string => value !== null)
    .sort();
  const latest = ends[ends.length - 1];
  if (hours === null || !latest) return {};
  const to = new Date(latest);
  return { from: new Date(to.getTime() - hours * 3_600_000).toISOString(), to: latest };
}

export interface PointDetailState {
  pointId: string | null;
  point: MonitoringPoint | null;
  series: TimeSeriesSummary[];
  status: LoadStatus;
  error: string | null;
  /** The last request wins: an answer to an older one would show another point. */
  requestId: string | null;
  period: Period;
  /** Metrics and readings of every series for the current period. */
  data: {
    status: LoadStatus;
    error: string | null;
    requestId: string | null;
    metrics: Record<string, SeriesMetrics>;
    readings: Record<string, ReadingsAnswer>;
  };
  /** The forecast of every series, loaded only while it is shown. */
  forecast: {
    shown: boolean;
    status: LoadStatus;
    error: string | null;
    requestId: string | null;
    bySeries: Record<string, Forecast>;
  };
}

const emptyData: PointDetailState['data'] = {
  status: 'idle',
  error: null,
  requestId: null,
  metrics: {},
  readings: {},
};

const emptyForecast: PointDetailState['forecast'] = {
  shown: false,
  status: 'idle',
  error: null,
  requestId: null,
  bySeries: {},
};

const initialState: PointDetailState = {
  pointId: null,
  point: null,
  series: [],
  status: 'idle',
  error: null,
  requestId: null,
  period: 'all',
  data: emptyData,
  forecast: emptyForecast,
};

type Config = { rejectValue: RequestFailure };

function attempt<T>(
  request: () => Promise<T>,
  rejectWithValue: (failure: RequestFailure) => unknown,
) {
  return request().catch((error: unknown) => rejectWithValue(toFailure(error)) as never);
}

/** The metrics and readings of the given series, for a period. */
export const fetchSeriesData = createAsyncThunk<
  { metrics: Record<string, SeriesMetrics>; readings: Record<string, ReadingsAnswer> },
  { series: TimeSeriesSummary[]; period: Period },
  Config
>('pointDetail/fetchData', ({ series, period }, { rejectWithValue }) =>
  attempt(async () => {
    const range = rangeOf(period, series);
    const query = (extra: Record<string, string> = {}) => {
      const params = new URLSearchParams({ ...range, ...extra }).toString();
      return params ? `?${params}` : '';
    };
    const answers = await Promise.all(
      series.map(async (item) => {
        const [metrics, readings] = await Promise.all([
          getJson<SeriesMetrics>(`/time-series/${item.id}/metrics${query()}`),
          getJson<ReadingsAnswer>(
            `/time-series/${item.id}/readings${query({ maxPoints: String(MAX_CHART_POINTS) })}`,
          ),
        ]);
        return { id: item.id, metrics, readings };
      }),
    );
    return {
      metrics: Object.fromEntries(answers.map((answer) => [answer.id, answer.metrics])),
      readings: Object.fromEntries(answers.map((answer) => [answer.id, answer.readings])),
    };
  }, rejectWithValue),
);

/** The point and its series; the page then loads their data for the period. */
export const fetchPointDetail = createAsyncThunk<
  { point: MonitoringPoint; series: TimeSeriesSummary[] },
  string,
  Config
>('pointDetail/fetch', (pointId, { rejectWithValue }) =>
  attempt(async () => {
    const [point, series] = await Promise.all([
      getJson<MonitoringPoint>(`/monitoring-points/${pointId}`),
      getJson<TimeSeriesSummary[]>(`/monitoring-points/${pointId}/time-series`),
    ]);
    return { point, series };
  }, rejectWithValue),
);

/** Removes a series with its readings, then reloads what the point now holds. */
export const deleteSeries = createAsyncThunk<void, { pointId: string; seriesId: string }, Config>(
  'pointDetail/deleteSeries',
  ({ pointId, seriesId }, { rejectWithValue, dispatch }) =>
    attempt(async () => {
      await deleteJson(`/time-series/${seriesId}`);
      void dispatch(fetchPointDetail(pointId));
    }, rejectWithValue),
);

/** The forecast of each series: the next 24 hours, or the reason there is none. */
export const fetchForecasts = createAsyncThunk<
  Record<string, Forecast>,
  TimeSeriesSummary[],
  Config
>('pointDetail/fetchForecasts', (series, { rejectWithValue }) =>
  attempt(async () => {
    const answers = await Promise.all(
      series.map(async (item) => ({
        id: item.id,
        forecast: await getJson<Forecast>(`/time-series/${item.id}/forecast`),
      })),
    );
    return Object.fromEntries(answers.map((answer) => [answer.id, answer.forecast]));
  }, rejectWithValue),
);

export const pointDetailSlice = createSlice({
  name: 'pointDetail',
  initialState,
  reducers: {
    periodChanged: (state, action: PayloadAction<Period>) => {
      state.period = action.payload;
    },
    forecastToggled: (state, action: PayloadAction<boolean>) => {
      state.forecast.shown = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPointDetail.pending, (state, action) => {
        if (state.pointId !== action.meta.arg) {
          // Another point: nothing of the previous one may show meanwhile.
          // The period and the forecast switch are choices of the user, and stay.
          Object.assign(state, initialState, {
            period: state.period,
            forecast: { ...emptyForecast, shown: state.forecast.shown },
          });
          state.pointId = action.meta.arg;
        }
        state.requestId = action.meta.requestId;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPointDetail.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.status = 'loaded';
        state.point = action.payload.point;
        state.series = action.payload.series;
      })
      .addCase(fetchPointDetail.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Could not load the monitoring point.';
      })
      .addCase(fetchSeriesData.pending, (state, action) => {
        state.data.requestId = action.meta.requestId;
        state.data.status = 'loading';
        state.data.error = null;
      })
      .addCase(fetchSeriesData.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.data.requestId) return;
        state.data = { ...state.data, status: 'loaded', ...action.payload };
      })
      .addCase(fetchSeriesData.rejected, (state, action) => {
        if (action.meta.requestId !== state.data.requestId) return;
        state.data.status = 'failed';
        state.data.error = action.payload?.message ?? 'Could not load the readings.';
      })
      .addCase(fetchForecasts.pending, (state, action) => {
        state.forecast.requestId = action.meta.requestId;
        state.forecast.status = 'loading';
        state.forecast.error = null;
      })
      .addCase(fetchForecasts.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.forecast.requestId) return;
        state.forecast.status = 'loaded';
        state.forecast.bySeries = action.payload;
      })
      .addCase(fetchForecasts.rejected, (state, action) => {
        if (action.meta.requestId !== state.forecast.requestId) return;
        state.forecast.status = 'failed';
        state.forecast.error = action.payload?.message ?? 'Could not load the forecast.';
      });
  },
});

export const { periodChanged, forecastToggled } = pointDetailSlice.actions;
