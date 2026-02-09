import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';

export interface TelemetryRegistry {
  id: number;
  sensorId: string;
  accelerationValue: number;
  velocityValue: number;
  temperatureValue: number;
  timestamp: string;
  sensor?: {
    monitoringPoint: {
      name: string;
    };
  };
}

interface TelemetryState {
  items: TelemetryRegistry[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TelemetryState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
};

export const fetchTelemetry = createAsyncThunk(
  'telemetry/fetchAll',
  async ({ 
    page, 
    limit = 10, 
    sortField, 
    sortOrder 
  }: { 
    page: number; 
    limit?: number; 
    sortField?: string; 
    sortOrder?: 'asc' | 'desc' | null 
  }) => {
    const response = await api.get('/telemetry', {
      params: { 
        page, 
        limit,
        sortField,
        sortOrder: sortOrder || undefined
      },
    });
    console.log('Data:', response.data);
    
    return response.data;
  }
);

export const deleteTelemetry = createAsyncThunk(
  'telemetry/delete',
  async (ids: number | number[]) => {
    const idsString = Array.isArray(ids) ? ids.join(',') : ids.toString();
    await api.delete(`/telemetry`, {
      params: { ids: idsString }
    });
    return ids;
  }
);

const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTelemetry.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTelemetry.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchTelemetry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch telemetry';
      })
      .addCase(deleteTelemetry.fulfilled, (state, action) => {
        const deletedIds = Array.isArray(action.payload) ? action.payload : [action.payload];
        state.items = state.items.filter((item) => !deletedIds.includes(item.id));
        state.total -= deletedIds.length;
      });
  },
});

export default telemetrySlice.reducer;
