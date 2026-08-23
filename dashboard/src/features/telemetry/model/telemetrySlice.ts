import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TelemetryResponse, TelemetryState } from "./types";
const initialState: TelemetryState = { data: [], status: "idle", error: null };
const telemetrySlice = createSlice({
  name: "telemetry",
  initialState,
  reducers: {
    fetchRequested(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchCancelled(state) {
      if (state.status === "loading") state.status = "idle";
    },
    fetchSucceeded(state, action: PayloadAction<TelemetryResponse>) {
      state.status = "succeeded";
      state.data = action.payload;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});
export const telemetryActions = telemetrySlice.actions;
export const telemetryReducer = telemetrySlice.reducer;
