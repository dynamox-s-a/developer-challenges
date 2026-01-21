/**
 * Redux slice do domínio de monitoramento,
 * responsável por armazenar pontos e validar regras do domínio
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MonitoringPoint } from './monitoring.types';

export interface MonitoringState {
  items: MonitoringPoint[];
  error?: string;
}

const initialState: MonitoringState = {
  items: [],
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    addMonitoringPoint(state, action: PayloadAction<MonitoringPoint>) {
      state.items.push(action.payload);
      state.error = undefined;
    },

    deleteMonitoringPointsByMachine(state, action: PayloadAction<string>) {
      const machineId = action.payload;
      state.items = state.items.filter((mp) => mp.machineId !== machineId);
      state.error = undefined;
    },

    clearMonitoringError(state) {
      state.error = undefined;
    },
  },
});

export const {
  addMonitoringPoint,
  clearMonitoringError,
  deleteMonitoringPointsByMachine,
} = monitoringSlice.actions;

export default monitoringSlice.reducer;
