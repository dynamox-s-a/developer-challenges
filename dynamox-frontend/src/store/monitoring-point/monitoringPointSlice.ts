import { createSlice } from "@reduxjs/toolkit";
import { fetchMonitoringPoints } from "./monitoringPointThunks";
import { MonitoringPoint } from "./monitoringPointTypes";

interface MonitoringPointState {
  items: MonitoringPoint[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
}

const initialState: MonitoringPointState = {
  items: [],
  status: "idle",
  loading: false,
  error: null,
};

const monitoringPointSlice = createSlice({
  name: "monitoringPoints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Erro desconhecido";
      });
  },
});

export default monitoringPointSlice.reducer;
