import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMonitoringPoints } from "./monitoringPointThunks";
import { MonitoringPoint } from "./monitoringPointTypes";
import {
  createMonitoringPoint,
  updateMonitoringPoint,
  deleteMonitoringPoint,
} from "./monitoringPointThunks";

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
      .addCase(
        fetchMonitoringPoints.fulfilled,
        (state, action: PayloadAction<MonitoringPoint[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Erro desconhecido";
      })

      .addCase(createMonitoringPoint.fulfilled, (state, action: PayloadAction<MonitoringPoint>) => {
        state.items.push(action.payload);
      })
      .addCase(createMonitoringPoint.rejected, (state, action) => {
        state.error = action.error.message || "Erro desconhecido";
      })

      .addCase(updateMonitoringPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMonitoringPoint.fulfilled, (state, action: PayloadAction<MonitoringPoint>) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateMonitoringPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao atualizar";
      })

      .addCase(deleteMonitoringPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMonitoringPoint.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteMonitoringPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao excluir";
      });
  },
});

export default monitoringPointSlice.reducer;
