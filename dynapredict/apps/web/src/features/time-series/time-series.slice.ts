import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TimeSeriesUpload } from '@dynapredict/shared';
import { api, getApiErrorMessage } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';
import type { MonitoringPoint } from '../monitoring-points/monitoring-points.slice';

// Uma série como a lista da API devolve: o resumo, sem as medições.
// As datas chegam como texto (ISO), porque o JSON não tem tipo de data
export type TimeSeriesSummary = {
  id: string;
  name: string;
  unit: string | null;
  sensorSerialNumber: string;
  monitoringPointId: string;
  sampleCount: number;
  startedAt: string;
  endedAt: string;
  createdAt: string;
};

type TimeSeriesState = {
  // O ponto da página aberta e as séries dele
  point: MonitoringPoint | null;
  items: TimeSeriesSummary[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: TimeSeriesState = {
  point: null,
  items: [],
  status: 'idle',
  error: null,
};

// Busca o ponto e as séries dele ao mesmo tempo (Promise.all): são duas
// chamadas independentes, então uma não precisa esperar a outra
export const fetchPointTimeSeries = createAsyncThunk<
  { point: MonitoringPoint; series: TimeSeriesSummary[] },
  string,
  { rejectValue: string }
>('timeSeries/fetchPoint', async (pointId, { rejectWithValue, signal }) => {
  try {
    const [point, series] = await Promise.all([
      api.get<MonitoringPoint>(`/monitoring-points/${pointId}`, { signal }),
      api.get<TimeSeriesSummary[]>(
        `/monitoring-points/${pointId}/time-series`,
        { signal },
      ),
    ]);
    return { point: point.data, series: series.data };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// Envia uma série para o ponto. A lista não é mexida aqui: quem chamou
// busca de novo, porque é a API que sabe em que ordem as séries ficam
export const uploadTimeSeries = createAsyncThunk<
  TimeSeriesSummary,
  TimeSeriesUpload & { pointId: string },
  { rejectValue: string }
>('timeSeries/upload', async ({ pointId, ...upload }, { rejectWithValue }) => {
  try {
    const { data } = await api.post<TimeSeriesSummary>(
      `/monitoring-points/${pointId}/time-series`,
      upload,
    );
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const timeSeriesSlice = createSlice({
  name: 'timeSeries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // O ponto anterior fica na store até o novo chegar. Quem decide se
      // ele aparece é a página, que só mostra o ponto da URL
      .addCase(fetchPointTimeSeries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPointTimeSeries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.point = action.payload.point;
        state.items = action.payload.series;
      })
      .addCase(fetchPointTimeSeries.rejected, (state, action) => {
        // Cancelada de propósito (saiu da página): não é erro
        if (action.meta.aborted) {
          return;
        }
        state.status = 'failed';
        state.error = action.payload ?? 'Erro inesperado';
      })
      // Saiu do sistema? Esquece o ponto e as séries
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const timeSeriesReducer = timeSeriesSlice.reducer;
