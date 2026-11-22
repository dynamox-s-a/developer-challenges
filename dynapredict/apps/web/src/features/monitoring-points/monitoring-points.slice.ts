import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  MachineType,
  MonitoringPointInput,
  MonitoringPointListQuery,
  SensorModel,
} from '@dynapredict/shared';
import { api, getApiErrorMessage } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';

// Um ponto como a lista da API devolve: já com a máquina e o sensor
export type MonitoringPoint = {
  id: string;
  name: string;
  machine: { id: string; name: string; type: MachineType };
  sensor: { id: string; model: SensorModel; serialNumber: string } | null;
};

// Uma página da lista: os pontos dela e o total de pontos (de todas as páginas)
export type MonitoringPointsPage = {
  items: MonitoringPoint[];
  total: number;
  page: number;
  pageSize: number;
};

type MonitoringPointsState = {
  items: MonitoringPoint[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: MonitoringPointsState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
};

// Busca uma página já ordenada. O "signal" deixa cancelar a requisição:
// a página cancela a busca antiga quando o usuário troca de página ou ordem
export const fetchMonitoringPoints = createAsyncThunk<
  MonitoringPointsPage,
  MonitoringPointListQuery,
  { rejectValue: string }
>('monitoringPoints/fetchPage', async (query, { rejectWithValue, signal }) => {
  try {
    const { data } = await api.get<MonitoringPointsPage>('/monitoring-points', {
      params: query,
      signal,
    });
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// O que o POST devolve: o ponto sozinho, sem a máquina e o sensor junto
type CreatedMonitoringPoint = { id: string; name: string; machineId: string };

// O ponto novo: a máquina vai na URL e o nome vai no corpo. A lista não é
// mexida aqui: quem chamou busca a página de novo, porque é a API que sabe
// em que página e em que posição o ponto novo entra
export const createMonitoringPoint = createAsyncThunk<
  CreatedMonitoringPoint,
  MonitoringPointInput & { machineId: string },
  { rejectValue: string }
>(
  'monitoringPoints/create',
  async ({ machineId, ...input }, { rejectWithValue }) => {
    try {
      const { data } = await api.post<CreatedMonitoringPoint>(
        `/machines/${machineId}/monitoring-points`,
        input,
      );
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        // Cancelada de propósito: não é erro, e a busca nova já está a caminho
        if (action.meta.aborted) {
          return;
        }
        state.status = 'failed';
        state.error = action.payload ?? 'Erro inesperado';
      })
      // Saiu do sistema? Esquece os pontos (o próximo login busca de novo)
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const monitoringPointsReducer = monitoringPointsSlice.reducer;
