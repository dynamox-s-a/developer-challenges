import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoadStatus, MeasurementSeries } from "./types";

export type DashboardState = {
  series: MeasurementSeries[];
  status: LoadStatus;
  error: string | null;
  periodDays: number | null;
};

export const initialState: DashboardState = {
  series: [],
  status: "idle",
  error: null,
  periodDays: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    measurementsRequested(state) {
      state.status = "loading";
      state.error = null;
    },
    measurementsSucceeded(state, action: PayloadAction<MeasurementSeries[]>) {
      state.status = "succeeded";
      state.series = action.payload;
    },
    measurementsFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    periodChanged(state, action: PayloadAction<number | null>) {
      state.periodDays = action.payload;
    },
  },
});

export const {
  measurementsRequested,
  measurementsSucceeded,
  measurementsFailed,
  periodChanged,
} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
