import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MetricsResponse } from './types';

interface DataState {
  metrics: MetricsResponse;
  isLoading: boolean;
  error: string | null;
}

const initialState: DataState = {
  metrics: [],
  isLoading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    fetchMetricsRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchMetricsSuccess(state, action: PayloadAction<MetricsResponse>) {
      state.metrics = action.payload;
      state.isLoading = false;
    },
    fetchMetricsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMetricsRequest, fetchMetricsSuccess, fetchMetricsFailure } =
  dataSlice.actions;

export default dataSlice.reducer;
