import type {
  TimeSeriesDetail,
  TimeSeriesListResponse,
  TimeSeriesMetrics,
  TimeSeriesSample,
  TimeSeriesSummary,
} from "@dyn/contracts";
import { createSlice } from "@reduxjs/toolkit";
import type { TimeSeriesFilters } from "../../api/client";
import { createAppAsyncThunk } from "../../app/asyncThunk";

interface TimeSeriesState {
  result: TimeSeriesListResponse | null;
  metrics: TimeSeriesMetrics | null;
  fullSeries: TimeSeriesDetail | null;
  status: "idle" | "loading" | "ready" | "failed";
  detailStatus: "idle" | "loading" | "ready" | "failed";
  mutationStatus: "idle" | "submitting";
  listRequestId: string | null;
  detailRequestId: string | null;
  error: string | null;
}

const initialState: TimeSeriesState = {
  result: null,
  metrics: null,
  fullSeries: null,
  status: "idle",
  detailStatus: "idle",
  mutationStatus: "idle",
  listRequestId: null,
  detailRequestId: null,
  error: null,
};

export const fetchTimeSeries = createAppAsyncThunk<TimeSeriesListResponse, TimeSeriesFilters>(
  "timeSeries/fetch",
  (filters, { extra }) => extra.listTimeSeries(filters)
);

export const fetchTimeSeriesDetail = createAppAsyncThunk<
  { metrics: TimeSeriesMetrics; fullSeries: TimeSeriesDetail },
  string
>("timeSeries/fetchDetail", async (id, { extra }) => {
  const [metrics, fullSeries] = await Promise.all([
    extra.getTimeSeriesMetrics(id),
    extra.getFullTimeSeries(id),
  ]);
  return { metrics, fullSeries };
});

export const uploadTimeSeries = createAppAsyncThunk<
  TimeSeriesSummary,
  {
    monitoringPointId: string;
    label?: string;
    samples: TimeSeriesSample[];
  }
>("timeSeries/upload", ({ monitoringPointId, label, samples }, { extra }) =>
  extra.createTimeSeries(monitoringPointId, {
    ...(label ? { label } : {}),
    samples,
  })
);

export const deleteTimeSeries = createAppAsyncThunk<string, string>(
  "timeSeries/delete",
  async (id, { extra }) => {
    await extra.deleteTimeSeries(id);
    return id;
  }
);

const timeSeriesSlice = createSlice({
  name: "timeSeries",
  initialState,
  reducers: {
    clearTimeSeriesError(state) {
      state.error = null;
    },
    clearTimeSeriesDetail(state) {
      state.metrics = null;
      state.fullSeries = null;
      state.detailStatus = "idle";
      state.detailRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeSeries.pending, (state, action) => {
        state.status = "loading";
        state.listRequestId = action.meta.requestId;
        state.error = null;
      })
      .addCase(fetchTimeSeries.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) {
          return;
        }
        state.status = "ready";
        state.listRequestId = null;
        state.result = action.payload;
      })
      .addCase(fetchTimeSeries.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) {
          return;
        }
        state.status = "failed";
        state.listRequestId = null;
        state.error = action.error.message ?? "Unable to load time series.";
      })
      .addCase(fetchTimeSeriesDetail.pending, (state, action) => {
        state.detailStatus = "loading";
        state.detailRequestId = action.meta.requestId;
        state.error = null;
        state.metrics = null;
        state.fullSeries = null;
      })
      .addCase(fetchTimeSeriesDetail.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) {
          return;
        }
        state.detailStatus = "ready";
        state.detailRequestId = null;
        state.metrics = action.payload.metrics;
        state.fullSeries = action.payload.fullSeries;
      })
      .addCase(fetchTimeSeriesDetail.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) {
          return;
        }
        state.detailStatus = "failed";
        state.detailRequestId = null;
        state.error = action.error.message ?? "Unable to load the time series.";
      })
      .addCase(uploadTimeSeries.pending, beginMutation)
      .addCase(uploadTimeSeries.fulfilled, (state) => {
        state.mutationStatus = "idle";
      })
      .addCase(uploadTimeSeries.rejected, failMutation)
      .addCase(deleteTimeSeries.pending, beginMutation)
      .addCase(deleteTimeSeries.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        if (state.result) {
          state.result.items = state.result.items.filter((item) => item.id !== action.payload);
          state.result.total = Math.max(0, state.result.total - 1);
        }
      })
      .addCase(deleteTimeSeries.rejected, failMutation);
  },
});

function beginMutation(state: TimeSeriesState) {
  state.mutationStatus = "submitting";
  state.error = null;
}

function failMutation(state: TimeSeriesState, action: { error: { message?: string | undefined } }) {
  state.mutationStatus = "idle";
  state.error = action.error.message ?? "The operation failed.";
}

export const { clearTimeSeriesDetail, clearTimeSeriesError } = timeSeriesSlice.actions;
export const timeSeriesReducer = timeSeriesSlice.reducer;
