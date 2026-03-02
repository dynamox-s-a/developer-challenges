import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  CreateTimeSeriesBatchRequest,
  TimeSeriesEntry,
  TimeSeriesMetricsResponse,
} from '@dynamox/types';
import type { BaseState } from '../../types';
import { extractErrorMessage } from '../../../utils/form-errors';
import { timeSeriesAPI } from '../../../api/time-series';

export interface TimeSeriesState extends BaseState {
  entries: TimeSeriesEntry[];
  metrics: TimeSeriesMetricsResponse | null;
}

const initialState: TimeSeriesState = {
  entries: [],
  metrics: null,
  isLoading: false,
  error: null,
};

export const fetchTimeSeries = createAsyncThunk('timeSeries/fetch', async (sensorUuid: string) => {
  const [entriesRes, metricsRes] = await Promise.all([
    timeSeriesAPI.getTimeSeries(sensorUuid),
    timeSeriesAPI.getMetrics(sensorUuid),
  ]);
  return { entries: entriesRes.data.timeSeries, metrics: metricsRes.data };
});

export const createTimeSeries = createAsyncThunk(
  'timeSeries/create',
  async (
    { sensorUuid, data }: { sensorUuid: string; data: CreateTimeSeriesBatchRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await timeSeriesAPI.createTimeSeries(sensorUuid, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Erro ao criar registros de série temporal'),
      );
    }
  },
);

export const deleteAllTimeSeries = createAsyncThunk(
  'timeSeries/deleteAll',
  async (sensorUuid: string, { rejectWithValue }) => {
    try {
      await timeSeriesAPI.deleteAll(sensorUuid);
      return undefined;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Erro ao remover série temporal'));
    }
  },
);

export const timeSeriesSlice = createSlice({
  name: 'timeSeries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeSeries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTimeSeries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload.entries;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchTimeSeries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Erro ao carregar séries temporais';
      });

    builder
      .addCase(createTimeSeries.fulfilled, (state, action) => {
        state.entries = action.payload.timeSeries;
        state.metrics = action.payload.metrics;
      })
      .addCase(createTimeSeries.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao salvar séries temporais';
      });

    builder
      .addCase(deleteAllTimeSeries.fulfilled, (state) => {
        state.entries = [];
        state.metrics = null;
      })
      .addCase(deleteAllTimeSeries.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erro ao remover séries temporais';
      });
  },
});

export default timeSeriesSlice.reducer;
