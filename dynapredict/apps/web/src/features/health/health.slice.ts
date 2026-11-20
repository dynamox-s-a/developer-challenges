import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type HealthStatus = {
  api: string;
  database: string;
};

type HealthState = {
  data: HealthStatus | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: HealthState = {
  data: null,
  status: 'idle',
  error: null,
};

// Thunk: faz a chamada à API. O Redux dispara pending/fulfilled/rejected sozinho.
export const fetchHealth = createAsyncThunk('health/fetch', async () => {
  const response = await fetch('/api/health');
  const data = (await response.json()) as HealthStatus;
  return data; // isso vira o action.payload do "fulfilled"
});

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHealth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchHealth.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Não foi possível falar com a API';
      });
  },
});

export const healthReducer = healthSlice.reducer;
