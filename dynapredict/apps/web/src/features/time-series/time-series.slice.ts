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
  // Quantas séries existem no sistema todo (null = ainda não chegou)
  count: number | null;
};

const initialState: TimeSeriesState = {
  point: null,
  items: [],
  status: 'idle',
  error: null,
  count: null,
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

// Exclui uma série (e as medições dela). A API responde 204, sem corpo:
// o id volta para o reducer saber qual tirar da lista
export const deleteTimeSeries = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('timeSeries/delete', async (seriesId, { rejectWithValue }) => {
  try {
    await api.delete(`/time-series/${seriesId}`);
    return seriesId;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// Busca quantas séries existem no sistema todo, somando todos os pontos
export const fetchTimeSeriesCount = createAsyncThunk<number, void>(
  'timeSeries/fetchCount',
  async (_arg, { signal }) => {
    const { data } = await api.get<{ count: number }>('/time-series/count', {
      signal,
    });
    return data.count;
  },
);

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

      // A lista não tem páginas: basta tirar a série dela, sem buscar de novo
      .addCase(deleteTimeSeries.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      // Se a busca do total falhar, a página só não mostra o número: é uma
      // informação a mais, não vale um alerta de erro
      .addCase(fetchTimeSeriesCount.fulfilled, (state, action) => {
        state.count = action.payload;
      })

      // Saiu do sistema? Esquece o ponto e as séries
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const timeSeriesReducer = timeSeriesSlice.reducer;
