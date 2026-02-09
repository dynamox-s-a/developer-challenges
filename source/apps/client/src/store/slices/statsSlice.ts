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
  telemetryTrend: TelemetryTrend;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface SensorsDistribution {
  TcAg: number;
  TcAs: number;
  HF_Plus: number;
}

interface TelemetryTrend {
  timestamps: string[];
  acceleration: number[];
  velocity: number[];
  temperature: number[];
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
  telemetryTrend: {
    timestamps: [],
    acceleration: [],
    velocity: [],
    temperature: [],
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

export const fetchTelemetryTrend = createAsyncThunk('stats/fetchTelemetryTrend', async () => {
  const response = await api.get('/stats/telemetry-trend');
  console.log('Telemetry Trend:', response.data);
  return response.data;
});

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
      state.sensorsDistribution = action.payload;
    },
    updateTelemetryTrend(state, action) {
      state.telemetryTrend = action.payload;
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
      .addCase(fetchSensorsDistribution.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sensorsDistribution = action.payload;
      })
      .addCase(fetchTelemetryTrend.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTelemetryTrend.fulfilled, (state, action) => {        
        state.status = 'succeeded';
        state.telemetryTrend = action.payload;
      })
      .addCase(fetchTelemetryTrend.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch telemetry trend';
      });
  },
});

export const { updateStats, updateSensorsDistribution, updateTelemetryTrend } = statsSlice.actions;

export default statsSlice.reducer;
