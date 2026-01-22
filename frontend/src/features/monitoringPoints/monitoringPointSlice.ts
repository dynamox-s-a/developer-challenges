import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

export interface MonitoringPoint {
    point_id: number;
    machine_name: string;
    machine_type: string;
    point_name: string;
    sensor_model: string | null;
}

interface PointsState {
    items: MonitoringPoint[];
    total: number;
    page: number;
    loading: boolean;
    error: string | null;
    createError: string | null;
}

const initialState: PointsState = {
    items: [],
    total: 0,
    page: 1,
    loading: false,
    error: null,
    createError: null,
};

export const fetchMonitoringPoints = createAsyncThunk(
    'points/fetchList',
    async ({ page, sort_by, order }: { page: number, sort_by: string, order: 'asc' | 'desc' }, { rejectWithValue }) => {
        try {
            const response = await api.get('/monitoring-points', {
                params: { page, size: 5, sort_by, order }
            });
            return response.data;
        } catch(error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Erro ao carregar lista');
        }
    }
);

export const createMonitoringPoint = createAsyncThunk(
  'points/create',
  async ({ machineId, name }: { machineId: number; name: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/machines/${machineId}/monitoring-points`, { machine_id: machineId, name });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Erro ao criar ponto');
    }
  }
);

export const monitoringPointSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; state.createError = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => { state.loading = true; })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMonitoringPoint.pending, (state) => { state.loading = true; state.createError = null; })
      .addCase(createMonitoringPoint.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createMonitoringPoint.rejected, (state, action) => {
        state.loading = false;
        state.createError = action.payload as string;
      });
  }
});

export const { clearError } = monitoringPointSlice.actions;
export default monitoringPointSlice.reducer;
