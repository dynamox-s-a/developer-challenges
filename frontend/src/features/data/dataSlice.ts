import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChartData, MachineDto } from "./types";
import type { RootState } from "../../app/store";

type DataState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  machine: MachineDto | null;
  charts: ChartData | null;
};

const initialState: DataState = {
  status: "idle",
  error: null,
  machine: null,
  charts: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    fetchDataRequested(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchDataSucceeded(
      state,
      action: PayloadAction<{ machine: MachineDto; charts: ChartData }>,
    ) {
      state.status = "succeeded";
      state.machine = action.payload.machine;
      state.charts = action.payload.charts;
    },
    fetchDataFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { fetchDataRequested, fetchDataSucceeded, fetchDataFailed } =
  dataSlice.actions;
export const dataReducer = dataSlice.reducer;

export const selectDataStatus = (state: RootState) => state.data.status;
export const selectDataError = (state: RootState) => state.data.error;
export const selectMachine = (state: RootState) => state.data.machine;
export const selectCharts = (state: RootState) => state.data.charts;
