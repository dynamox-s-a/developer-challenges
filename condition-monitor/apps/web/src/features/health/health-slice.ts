import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getJson } from '../../api/http';

/**
 * Whether the API answers. `unknown` until the first check ends: not having asked yet is
 * not the same as the API being offline.
 */
export type ApiStatus = 'unknown' | 'online' | 'offline';

export interface HealthState {
  status: ApiStatus;
  checking: boolean;
}

const initialState: HealthState = { status: 'unknown', checking: false };

export const checkApiHealth = createAsyncThunk('health/check', () =>
  getJson<{ status: 'ok' }>('/health'),
);

export const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkApiHealth.pending, (state) => {
        state.checking = true;
      })
      .addCase(checkApiHealth.fulfilled, (state) => {
        state.checking = false;
        state.status = 'online';
      })
      .addCase(checkApiHealth.rejected, (state) => {
        state.checking = false;
        state.status = 'offline';
      });
  },
});
