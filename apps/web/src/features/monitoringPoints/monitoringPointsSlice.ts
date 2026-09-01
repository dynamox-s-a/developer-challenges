import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
  type ThunkDispatch,
  type UnknownAction,
} from '@reduxjs/toolkit';

import type { SensorModel } from '@dynamox/domain';

import {
  api,
  type MonitoringPointFilters,
  type MonitoringPointPageDto,
  type MonitoringPointSortColumn,
} from '../../api/client';
import type { RootState } from '../../store';
import type { RequestStatus } from '../../store/requestStatus';

export interface MonitoringPointsState {
  /** Página corrente devolvida pela API; a paginação e a ordenação são do servidor. */
  pageData: MonitoringPointPageDto | null;
  page: number;
  sortBy: MonitoringPointSortColumn;
  sortDir: 'asc' | 'desc';
  /** Recorte pedido ao servidor; a filtragem não acontece sobre a página carregada. */
  filters: MonitoringPointFilters;
  listStatus: RequestStatus;
  listError: string | null;
  createStatus: RequestStatus;
  createError: string | null;
  assignStatus: RequestStatus;
  assignError: string | null;
}

export const initialMonitoringPointsState: MonitoringPointsState = {
  pageData: null,
  page: 1,
  sortBy: 'machineName',
  sortDir: 'asc',
  filters: { search: null, machineType: null, sensorModel: null, hasSensor: null },
  listStatus: 'idle',
  listError: null,
  createStatus: 'idle',
  createError: null,
  assignStatus: 'idle',
  assignError: null,
};

type MonitoringPointsRootState = { monitoringPoints: MonitoringPointsState };
const createMonitoringPointsThunk = createAsyncThunk.withTypes<{
  state: MonitoringPointsRootState;
  dispatch: ThunkDispatch<MonitoringPointsRootState, unknown, UnknownAction>;
}>();

/** Busca a página corrente usando page/sort do próprio estado (fonte única). */
export const fetchMonitoringPoints = createMonitoringPointsThunk(
  'monitoringPoints/fetch',
  async (_: void, { getState }) => {
    const { monitoringPoints } = getState();
    return api.monitoringPoints({
      page: monitoringPoints.page,
      sortBy: monitoringPoints.sortBy,
      sortDir: monitoringPoints.sortDir,
      ...monitoringPoints.filters,
    });
  },
);

export const createMonitoringPoint = createMonitoringPointsThunk(
  'monitoringPoints/create',
  async (input: { machineId: string; name: string }, { dispatch }) => {
    const created = await api.createMonitoringPoint(input.machineId, input.name);
    // Paginação é do servidor: a lista local não sabe em que página o novo ponto cai.
    await dispatch(fetchMonitoringPoints());
    return created;
  },
);

export const assignSensor = createMonitoringPointsThunk(
  'monitoringPoints/assignSensor',
  async (
    input: { pointId: string; serialNumber: string; model: SensorModel },
    { dispatch },
  ) => {
    const updated = await api.assignSensor(input.pointId, input.serialNumber, input.model);
    await dispatch(fetchMonitoringPoints());
    return updated;
  },
);

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState: initialMonitoringPointsState,
  reducers: {
    pageChanged(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    /** Clicar na coluna já ordenada inverte a direção; noutra coluna, recomeça em asc. */
    sortChanged(state, action: PayloadAction<MonitoringPointSortColumn>) {
      if (state.sortBy === action.payload) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortDir = 'asc';
      }
      state.page = 1;
    },
    /**
     * Qualquer mudança de recorte volta para a primeira página: manter a página atual
     * deixaria o usuário numa página que talvez não exista mais no novo total.
     */
    filtersChanged(state, action: PayloadAction<Partial<MonitoringPointFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    filtersCleared(state) {
      state.filters = initialMonitoringPointsState.filters;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.pageData = action.payload;
        // A última página pode desaparecer (ex.: total caiu): recua para a anterior.
        const lastPage = Math.max(1, Math.ceil(action.payload.total / action.payload.pageSize));
        if (action.payload.items.length === 0 && state.page > lastPage) {
          state.page = lastPage;
        }
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.error.message ?? 'Não foi possível carregar os pontos.';
      })

      .addCase(createMonitoringPoint.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createMonitoringPoint.fulfilled, (state) => {
        state.createStatus = 'succeeded';
      })
      .addCase(createMonitoringPoint.rejected, (state, action) => {
        // A página carregada é preservada: falhar ao criar não pode esvaziar a tabela.
        state.createStatus = 'failed';
        state.createError = action.error.message ?? 'Não foi possível criar o ponto.';
      })

      .addCase(assignSensor.pending, (state) => {
        state.assignStatus = 'loading';
        state.assignError = null;
      })
      .addCase(assignSensor.fulfilled, (state) => {
        state.assignStatus = 'succeeded';
      })
      .addCase(assignSensor.rejected, (state, action) => {
        state.assignStatus = 'failed';
        state.assignError = action.error.message ?? 'Não foi possível associar o sensor.';
      });
  },
});

export const { pageChanged, sortChanged, filtersChanged, filtersCleared } =
  monitoringPointsSlice.actions;
export const monitoringPointsReducer = monitoringPointsSlice.reducer;

export const selectMonitoringPoints = (state: RootState): MonitoringPointsState =>
  state.monitoringPoints;

/** Há algum recorte ativo? Usado para oferecer "limpar" só quando faz sentido. */
export const selectHasActiveFilters = (state: RootState): boolean =>
  Object.values(state.monitoringPoints.filters).some((value) => value !== null);
