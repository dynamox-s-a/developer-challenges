import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/app/api/axios';
import type { MonitoringPoint, PaginatedResponse } from '@/app/types';

interface MonitoringPointsState {
  items: MonitoringPoint[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: MonitoringPointsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 0,
  loading: false,
  error: null,
};

export const fetchMonitoringPoints = createAsyncThunk(
  'monitoringPoints/fetchAll',
  async (params: { page: number; limit: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedResponse<MonitoringPoint>>('/monitoring-points', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monitoring points');
    }
  }
);

export const createMonitoringPoint = createAsyncThunk(
  'monitoringPoints/create',
  async (data: { name: string; machineId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/monitoring-points', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create monitoring point');
    }
  }
);

export const updateMonitoringPoint = createAsyncThunk(
  'monitoringPoints/update',
  async ({ id, data }: { id: string; data: { name?: string } }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/monitoring-points/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update monitoring point');
    }
  }
);

export const deleteMonitoringPoint = createAsyncThunk(
  'monitoringPoints/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/monitoring-points/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete monitoring point');
    }
  }
);

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.meta.total;
        state.page = action.payload.meta.page;
        state.limit = action.payload.meta.limit;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createMonitoringPoint.fulfilled, (state, action) => {
        // We might want to refetch or manually add, but since it's paginated, refetching is safer to keep order
        // For simplicity, we'll just add it to the top if it fits, or do nothing and let the user refresh/navigate
        // But to be UX friendly, let's just reload the current page
      })
      // Update
      .addCase(updateMonitoringPoint.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteMonitoringPoint.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total -= 1;
      });
  },
});

export default monitoringPointsSlice.reducer;
