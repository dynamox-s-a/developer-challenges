import {
  type CreateReadingsResultDto,
  DEFAULT_PREDICTION_HORIZON,
  DEFAULT_PREDICTION_WINDOW,
  MAX_READINGS_PAGE_SIZE,
  MAX_READINGS_PER_REQUEST,
  type PredictionDto,
  type ReadingDto,
  type ReadingInput,
  type ReadingsMetricsDto,
} from '@dynapredict/shared-types';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
  type ThunkDispatch,
  type UnknownAction,
} from '@reduxjs/toolkit';
import type { RequestStatus } from '../../app/requestStatus';
import type { RootState } from '../../app/rootReducer';
import { type ApiError, toApiError } from '../../services/apiClient';
import * as readingsApi from '../../services/readingsApi';
import type { PredictionQuery, TimeRange } from '../../services/readingsApi';
import { logout, sessionExpired } from '../auth/authSlice';

/**
 * The most points the chart loads (two pages). A longer series is cut and
 * flagged `truncated`; the metrics still cover all of it, and a narrower
 * range shows the rest.
 */
export const MAX_CHART_POINTS = 2 * MAX_READINGS_PAGE_SIZE;

export interface UploadProgress {
  sent: number;
  total: number;
}

export interface SensorReadingsState {
  /** Optional inclusive filter applied to the series and the metrics. */
  range: TimeRange;
  series: ReadingDto[];
  truncated: boolean;
  metrics: ReadingsMetricsDto | null;
  status: RequestStatus;
  error: ApiError | null;
  latestRequestId: string | null;

  predictionQuery: PredictionQuery;
  prediction: PredictionDto | null;
  predictionStatus: RequestStatus;
  /** 422 when the series has fewer than 2 readings: expected, not a failure. */
  predictionError: ApiError | null;
  predictionRequestId: string | null;

  upload: UploadProgress | null;
}

export interface ReadingsState {
  bySensorId: Record<string, SensorReadingsState>;
}

export const DEFAULT_PREDICTION_QUERY: PredictionQuery = {
  method: 'movingAverage',
  window: DEFAULT_PREDICTION_WINDOW,
  horizon: DEFAULT_PREDICTION_HORIZON,
};

export function emptySensorReadings(): SensorReadingsState {
  return {
    range: {},
    series: [],
    truncated: false,
    metrics: null,
    status: 'idle',
    error: null,
    latestRequestId: null,
    predictionQuery: DEFAULT_PREDICTION_QUERY,
    prediction: null,
    predictionStatus: 'idle',
    predictionError: null,
    predictionRequestId: null,
    upload: null,
  };
}

const initialState: ReadingsState = { bySensorId: {} };

/** A sensor's slot, created on first use. */
function slot(state: ReadingsState, sensorId: string): SensorReadingsState {
  state.bySensorId[sensorId] ??= emptySensorReadings();
  return state.bySensorId[sensorId];
}

/** Shared fallback for sensors never loaded; never mutated. */
const EMPTY = emptySensorReadings();

export function selectSensorReadings(
  state: RootState,
  sensorId: string,
): SensorReadingsState {
  return state.readings.bySensorId[sensorId] ?? EMPTY;
}

type ThunkConfig = { state: RootState; rejectValue: ApiError };

/** Pages through the series by cursor until it ends or the cap is reached. */
async function loadSeries(sensorId: string, range: TimeRange) {
  const series: ReadingDto[] = [];
  let after: string | undefined;
  do {
    const page = await readingsApi.listReadings(sensorId, {
      ...range,
      after,
      limit: MAX_READINGS_PAGE_SIZE,
    });
    series.push(...page.data);
    after = page.meta.nextCursor ?? undefined;
  } while (after && series.length < MAX_CHART_POINTS);
  return { series, truncated: after !== undefined };
}

/** The series for the chart and its metrics, for the sensor's current range. */
export const loadReadings = createAsyncThunk<
  { series: ReadingDto[]; truncated: boolean; metrics: ReadingsMetricsDto },
  string,
  ThunkConfig
>('readings/load', async (sensorId, { getState, rejectWithValue }) => {
  const { range } = selectSensorReadings(getState(), sensorId);
  try {
    const [{ series, truncated }, metrics] = await Promise.all([
      loadSeries(sensorId, range),
      readingsApi.getReadingsMetrics(sensorId, range),
    ]);
    return { series, truncated, metrics };
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const loadPrediction = createAsyncThunk<
  PredictionDto,
  string,
  ThunkConfig
>('readings/prediction', async (sensorId, { getState, rejectWithValue }) => {
  const { predictionQuery } = selectSensorReadings(getState(), sensorId);
  try {
    return await readingsApi.getPrediction(sensorId, predictionQuery);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/** Reloads what a write changed: the series, metrics and the forecast. */
function reloadAfterWrite(
  dispatch: ThunkDispatch<RootState, unknown, UnknownAction>,
  sensorId: string,
) {
  return Promise.all([
    dispatch(loadReadings(sensorId)),
    dispatch(loadPrediction(sensorId)),
  ]);
}

export interface UploadRejection extends ApiError {
  /** Readings stored before the failing batch; re-sending them is harmless. */
  sent: number;
}

/**
 * Sends the readings in batches of MAX_READINGS_PER_REQUEST, one after the
 * other (decisions.md #33), and adds up the results. A batch that fails
 * stops the upload; earlier batches stay stored, and since duplicates are
 * skipped the whole file can simply be sent again.
 */
export const uploadReadings = createAsyncThunk<
  CreateReadingsResultDto,
  { sensorId: string; readings: ReadingInput[] },
  { state: RootState; rejectValue: UploadRejection }
>(
  'readings/upload',
  async ({ sensorId, readings }, { dispatch, rejectWithValue }) => {
    const total: CreateReadingsResultDto = {
      received: 0,
      inserted: 0,
      duplicates: 0,
    };
    for (let i = 0; i < readings.length; i += MAX_READINGS_PER_REQUEST) {
      dispatch(uploadProgressed({ sensorId, sent: i, total: readings.length }));
      try {
        const result = await readingsApi.createReadings(
          sensorId,
          readings.slice(i, i + MAX_READINGS_PER_REQUEST),
        );
        total.received += result.received;
        total.inserted += result.inserted;
        total.duplicates += result.duplicates;
      } catch (error) {
        await reloadAfterWrite(dispatch, sensorId);
        return rejectWithValue({ ...toApiError(error), sent: i });
      }
    }
    await reloadAfterWrite(dispatch, sensorId);
    return total;
  },
);

/** Deletes the whole series, or only the readings within `range`. */
export const deleteReadings = createAsyncThunk<
  number,
  { sensorId: string; range?: TimeRange },
  ThunkConfig
>(
  'readings/delete',
  async ({ sensorId, range = {} }, { dispatch, rejectWithValue }) => {
    try {
      const deleted = await readingsApi.deleteReadings(sensorId, range);
      await reloadAfterWrite(dispatch, sensorId);
      return deleted;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

const readingsSlice = createSlice({
  name: 'readings',
  initialState,
  reducers: {
    rangeChanged(
      state,
      action: PayloadAction<{ sensorId: string; range: TimeRange }>,
    ) {
      slot(state, action.payload.sensorId).range = action.payload.range;
    },
    predictionQueryChanged(
      state,
      action: PayloadAction<{
        sensorId: string;
        query: Partial<PredictionQuery>;
      }>,
    ) {
      const sensor = slot(state, action.payload.sensorId);
      sensor.predictionQuery = {
        ...sensor.predictionQuery,
        ...action.payload.query,
      };
    },
    uploadProgressed(
      state,
      action: PayloadAction<{ sensorId: string } & UploadProgress>,
    ) {
      const { sensorId, sent, total } = action.payload;
      slot(state, sensorId).upload = { sent, total };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadReadings.pending, (state, action) => {
        const sensor = slot(state, action.meta.arg);
        sensor.status = 'loading';
        sensor.error = null;
        sensor.latestRequestId = action.meta.requestId;
      })
      .addCase(loadReadings.fulfilled, (state, action) => {
        const sensor = slot(state, action.meta.arg);
        if (action.meta.requestId !== sensor.latestRequestId) return;
        sensor.status = 'succeeded';
        sensor.series = action.payload.series;
        sensor.truncated = action.payload.truncated;
        sensor.metrics = action.payload.metrics;
      })
      .addCase(loadReadings.rejected, (state, action) => {
        const sensor = slot(state, action.meta.arg);
        if (action.meta.requestId !== sensor.latestRequestId) return;
        sensor.status = 'failed';
        sensor.error = action.payload ?? toApiError(action.error);
      })
      .addCase(loadPrediction.pending, (state, action) => {
        const sensor = slot(state, action.meta.arg);
        sensor.predictionStatus = 'loading';
        sensor.predictionError = null;
        sensor.predictionRequestId = action.meta.requestId;
      })
      .addCase(loadPrediction.fulfilled, (state, action) => {
        const sensor = slot(state, action.meta.arg);
        if (action.meta.requestId !== sensor.predictionRequestId) return;
        sensor.predictionStatus = 'succeeded';
        sensor.prediction = action.payload;
      })
      .addCase(loadPrediction.rejected, (state, action) => {
        const sensor = slot(state, action.meta.arg);
        if (action.meta.requestId !== sensor.predictionRequestId) return;
        sensor.predictionStatus = 'failed';
        // A stale forecast for a series that changed would mislead.
        sensor.prediction = null;
        sensor.predictionError = action.payload ?? toApiError(action.error);
      })
      .addCase(uploadReadings.fulfilled, (state, action) => {
        slot(state, action.meta.arg.sensorId).upload = null;
      })
      .addCase(uploadReadings.rejected, (state, action) => {
        slot(state, action.meta.arg.sensorId).upload = null;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const { rangeChanged, predictionQueryChanged, uploadProgressed } =
  readingsSlice.actions;
export const readingsReducer = readingsSlice.reducer;
