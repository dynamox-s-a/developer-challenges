import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';

interface StatsState {
  totalTelemetry: number;
  machinesCount: number;
  monitoringPointsCount: number;
  activeSensorsCount: number;
  loading: boolean;
  error: string | null;
  sensorsDistribution: SensorsDistribution;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface SensorsDistribution {
  TcAg: number;
  TcAs: number;
  HF_Plus: number;
}

const initialState: StatsState = {
  totalTelemetry: 0,
  machinesCount: 0,
  monitoringPointsCount: 0,
  activeSensorsCount: 0,
  loading: false,
  error: null,
  sensorsDistribution: {
    TcAg: 0,
    TcAs: 0,
    HF_Plus: 0,
  },
  status: 'idle',
};

export const fetchTotalTelemetry = createAsyncThunk('stats/fetchTotalTelemetry', async () => {
  const response = await api.get('/stats/telemetry');
    return response.data;
});

export const fetchMachinesCount = createAsyncThunk('stats/fetchMachinesCount', async () => {
  const response = await api.get('/stats/machines');
  return response.data;
});

export const fetchMonitoringPointsCount = createAsyncThunk('stats/fetchMonitoringPointsCount', async () => {
  const response = await api.get('/stats/monitoring-points');
  return response.data;
});

export const fetchActiveSensorsCount = createAsyncThunk('stats/fetchActiveSensorsCount', async () => {
  const response = await api.get('/stats/active-sensors');
  return response.data;
});

export const fetchSensorsDistribution = createAsyncThunk('stats/fetchSensorsDistribution', async () => {
  const response = await api.get('/stats/sensors-distribution');
  return response.data;
})

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStats: (state, action) => {
      const { totalTelemetry, machinesCount, monitoringPointsCount, activeSensorsCount } = action.payload;
      if (totalTelemetry !== undefined) state.totalTelemetry = totalTelemetry;
      if (machinesCount !== undefined) state.machinesCount = machinesCount;
      if (monitoringPointsCount !== undefined) state.monitoringPointsCount = monitoringPointsCount;
      if (activeSensorsCount !== undefined) state.activeSensorsCount = activeSensorsCount;
    },
    updateSensorsDistribution(state, action) {
      console.log('action.payload', action.payload);
      
      state.sensorsDistribution = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalTelemetry.fulfilled, (state, action) => {
        state.totalTelemetry = action.payload.totalTelemetry;
      })
      .addCase(fetchMachinesCount.fulfilled, (state, action) => {
        state.machinesCount = action.payload.machinesCount;
      })
      .addCase(fetchMonitoringPointsCount.fulfilled, (state, action) => {
        state.monitoringPointsCount = action.payload.monitoringPointsCount;
      })
      .addCase(fetchActiveSensorsCount.fulfilled, (state, action) => {
        state.activeSensorsCount = action.payload.activeSensorsCount;
      })
      .addCase(fetchSensorsDistribution.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchSensorsDistribution.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sensorsDistribution = action.payload;
      })
      .addCase(fetchSensorsDistribution.pending, (state) => {
        state.status = 'loading';
      });
  },
});

export const { updateStats, updateSensorsDistribution } = statsSlice.actions;

export default statsSlice.reducer;
