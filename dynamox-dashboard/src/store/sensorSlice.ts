import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SensorState, SensorData } from '../types/sensor';

const initialState: SensorState = {
  loading: false,
  error: null,
  data: []
};

const sensorSlice = createSlice({
  name: 'sensor',
  initialState,
  reducers: {
    fetchDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action: PayloadAction<SensorData[]>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchDataRequest, fetchDataSuccess, fetchDataFailure } = sensorSlice.actions;
export default sensorSlice.reducer;
