import type { Series } from '@repo/contracts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RequestStatus } from '../types';
import type { Period } from './period';

export type MeasurementsState = {
  series: Series[];
  period: Period;
  status: RequestStatus;
  error: string | null;
};

const initialState: MeasurementsState = {
  series: [],
  period: 'all',
  status: 'idle',
  error: null,
};

export const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    fetchMeasurements: (state, _action: PayloadAction<{ machineId: string }>) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchMeasurementsSucceeded: (state, action: PayloadAction<Series[]>) => {
      state.status = 'succeeded';
      state.series = action.payload;
    },
    fetchMeasurementsFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
      state.series = [];
    },
    periodChanged: (state, action: PayloadAction<Period>) => {
      state.period = action.payload;
    },
  },
});

export const {
  fetchMeasurements,
  fetchMeasurementsSucceeded,
  fetchMeasurementsFailed,
  periodChanged,
} = measurementsSlice.actions;
