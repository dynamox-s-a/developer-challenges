import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MetricsResponse } from './types';

interface DataState {
  metrics: MetricsResponse;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  metrics: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    fetchMetricsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMetricsSuccess(state, action: PayloadAction<MetricsResponse>) {
      state.metrics = action.payload;
      state.loading = false;
    },
    fetchMetricsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMetricsRequest, fetchMetricsSuccess, fetchMetricsFailure } =
  dataSlice.actions;

export default dataSlice.reducer;
