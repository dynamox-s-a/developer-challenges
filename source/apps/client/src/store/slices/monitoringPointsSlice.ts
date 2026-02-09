import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from 'api/api';

export interface TelemetryPoint {
  accelerationValue: number;
  velocityValue: number;
  temperatureValue: number;
  timestamp: string;
}

export interface MonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  machine: {
    id: number;
    name: string;
    type: string;
  };
  sensor?: {
    id: string;
    model: string;
    telemetry?: TelemetryPoint[];
  };
}

interface MonitoringPointsState {
  items: MonitoringPoint[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MonitoringPointsState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
};

export const fetchMonitoringPoints = createAsyncThunk(
  'monitoringPoints/fetchAll',
  async ({ page, sortBy, sortOrder }: { page: number; sortBy?: string; sortOrder?: string }) => {
    const response = await api.get('/monitoring-points', {
      params: { page, sortBy, sortOrder },
    });
    return response.data;
  }
);

export const createMonitoringPoint = createAsyncThunk(
  'monitoringPoints/create',
  async (data: { name: string; machineId: number }) => {
    const response = await api.post('/monitoring-points', data);
    return response.data;
  }
);

export const associateSensor = createAsyncThunk(
  'monitoringPoints/associateSensor',
  async ({ pointId, sensorId, model }: { pointId: number; sensorId: string; model: string }) => {
    const response = await api.post(`/monitoring-points/${pointId}/sensors`, { id: sensorId, model });
    return response.data;
  }
);

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {
    updateTelemetry(state, action: PayloadAction<{ sensorId: string; telemetry: TelemetryPoint }>) {
      const { sensorId, telemetry } = action.payload;
      const point = state.items.find((item) => item.sensor?.id === sensorId);
      if (point && point.sensor) {
        // Replace previous telemetry with the new one (latest)
        point.sensor.telemetry = [telemetry];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch monitoring points';
      })
      .addCase(createMonitoringPoint.fulfilled, (state, action) => {
        // Optionally add to items if we want immediate feedback, 
        // but usually we re-fetch to ensure sorting/pagination is correct.
        state.items.unshift(action.payload);
        state.total += 1;
      });
  },
});

export const { updateTelemetry } = monitoringPointsSlice.actions;
export default monitoringPointsSlice.reducer;
