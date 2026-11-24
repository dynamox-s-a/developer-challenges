import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getApiErrorMessage } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';
import type { TimeSeriesSummary } from './time-series.slice';

// Uma medição como a API devolve: o instante chega como texto (ISO)
export type TimeSeriesSample = { timestamp: string; value: number };

// A série inteira: o resumo e todas as medições, em ordem de tempo
export type TimeSeriesDetails = TimeSeriesSummary & {
  samples: TimeSeriesSample[];
};

// As métricas que a API calcula sobre todas as medições da série
export type TimeSeriesMetrics = {
  count: number;
  min: number;
  max: number;
  mean: number;
  stdDev: number;
  rms: number;
};

type TimeSeriesDetailsState = {
  // A série da página aberta e as métricas dela
  series: TimeSeriesDetails | null;
  metrics: TimeSeriesMetrics | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: TimeSeriesDetailsState = {
  series: null,
  metrics: null,
  status: 'idle',
  error: null,
};

// Busca a série e as métricas dela ao mesmo tempo, como na página do ponto
export const fetchTimeSeriesDetails = createAsyncThunk<
  { series: TimeSeriesDetails; metrics: TimeSeriesMetrics },
  string,
  { rejectValue: string }
>('timeSeriesDetails/fetch', async (seriesId, { rejectWithValue, signal }) => {
  try {
    const [series, metrics] = await Promise.all([
      api.get<TimeSeriesDetails>(`/time-series/${seriesId}`, { signal }),
      api.get<TimeSeriesMetrics>(`/time-series/${seriesId}/metrics`, {
        signal,
      }),
    ]);
    return { series: series.data, metrics: metrics.data };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const timeSeriesDetailsSlice = createSlice({
  name: 'timeSeriesDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // A série anterior fica na store até a nova chegar. Como na página do
      // ponto, quem decide se ela aparece é a página
      .addCase(fetchTimeSeriesDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTimeSeriesDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.series = action.payload.series;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchTimeSeriesDetails.rejected, (state, action) => {
        // Cancelada de propósito (saiu da página): não é erro
        if (action.meta.aborted) {
          return;
        }
        state.status = 'failed';
        state.error = action.payload ?? 'Erro inesperado';
      })
      // Saiu do sistema? Esquece a série
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const timeSeriesDetailsReducer = timeSeriesDetailsSlice.reducer;
