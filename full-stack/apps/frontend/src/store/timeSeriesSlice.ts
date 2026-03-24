import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchTimeSeries,
  fetchTimeSeriesMetrics,
} from "../api/timeSeries";
import type {
  TimeSeriesListResponse,
  TimeSeriesMetrics,
} from "../api/timeSeries";

type State = {
  list: TimeSeriesListResponse | null;
  metrics: TimeSeriesMetrics | null;
  loading: boolean;
  error: string | null;
  take: number;
  skip: number;
  monitoringPointId: string | null;
};

const initialState: State = {
  list: null,
  metrics: null,
  loading: false,
  error: null,
  take: 50,
  skip: 0,
  monitoringPointId: null,
};

export const loadTimeSeries = createAsyncThunk(
  "timeSeries/load",
  async (args: { monitoringPointId: string; take: number; skip: number }) => {
    const [list, metrics] = await Promise.all([
      fetchTimeSeries(args.monitoringPointId, { take: args.take, skip: args.skip }),
      fetchTimeSeriesMetrics(args.monitoringPointId),
    ]);
    return { list, metrics };
  }
);

const slice = createSlice({
  name: "timeSeries",
  initialState,
  reducers: {
    openForMonitoringPoint(state, action: { payload: { id: string } }) {
      state.monitoringPointId = action.payload.id;
      state.skip = 0;
      state.error = null;
      state.list = null;
      state.metrics = null;
    },
    close(state) {
      state.monitoringPointId = null;
      state.error = null;
      state.list = null;
      state.metrics = null;
    },
    setPage(state, action: { payload: { skip: number; take: number } }) {
      state.skip = action.payload.skip;
      state.take = action.payload.take;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadTimeSeries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTimeSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.metrics = action.payload.metrics;
      })
      .addCase(loadTimeSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load time-series";
      });
  },
});

export const { openForMonitoringPoint, close, setPage } = slice.actions;
export default slice.reducer;
