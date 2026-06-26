import type { PayloadAction } from '@reduxjs/toolkit';
import type { SensorState, MetricSeries, SensorDataResponse } from '../../types/sensor.types';
import { createSlice } from '@reduxjs/toolkit';

const findMetric = (data: SensorDataResponse, name: string): MetricSeries | null => {
  return data.find((item) => item.name === name) || null;
};

const initialState: SensorState = {
  loading: false,
  error: null,
  allMetrics: [],
  acceleration: { x: null, y: null, z: null },
  velocity: { x: null, y: null, z: null },
  temperature: null,
  hoveredTimestamp: null,
};

const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  reducers: {
    fetchDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action: PayloadAction<SensorDataResponse>) => {
      state.loading = false;
      state.allMetrics = action.payload;

      // Popula Aceleração (3 eixos)
      state.acceleration.x = findMetric(action.payload, 'accelerationRms/x');
      state.acceleration.y = findMetric(action.payload, 'accelerationRms/y');
      state.acceleration.z = findMetric(action.payload, 'accelerationRms/z');

      // Popula Velocidade (3 eixos)
      state.velocity.x = findMetric(action.payload, 'velocityRms/x');
      state.velocity.y = findMetric(action.payload, 'velocityRms/y');
      state.velocity.z = findMetric(action.payload, 'velocityRms/z');

      // Popula Temperatura (1 série)
      state.temperature = findMetric(action.payload, 'temperature');
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setHoveredTimestamp: (state, action: PayloadAction<number | null>) => {
      state.hoveredTimestamp = action.payload;
    },
  },
});

export const {
  fetchDataRequest,
  fetchDataSuccess,
  fetchDataFailure,
  setHoveredTimestamp,
} = sensorSlice.actions;

export default sensorSlice.reducer;