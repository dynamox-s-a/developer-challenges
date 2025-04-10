import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MonitoringPoint } from '../../services/api';

interface MonitoringPointsState {
  data: MonitoringPoint[];
  loading: boolean;
  error: string | null;
}

const initialState: MonitoringPointsState = {
  data: [],
  loading: false,
  error: null,
};

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {
    fetchMonitoringPointsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMonitoringPointsSuccess(state, action: PayloadAction<MonitoringPoint[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchMonitoringPointsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMonitoringPointsStart, fetchMonitoringPointsSuccess, fetchMonitoringPointsFailure } = monitoringPointsSlice.actions;
export default monitoringPointsSlice.reducer;