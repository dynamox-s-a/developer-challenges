import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import type {
  CreateReadingsInput,
  DeleteReadingsResult,
  InsertReadingsResult,
  MeasurementMetric,
  Reading,
  ReadingsMetrics,
  ReadingsRangeQuery,
} from "@full-stack-solution/shared";
import { serializeApiError, type SerializedApiError } from "@web/api/api-error";
import { requireToken } from "@web/app/require-token";
import type { RootState } from "@web/app/store";
import type { ThunkConfig } from "@web/app/thunk";
import type { LoadStatus } from "@web/features/machines/machines.slice";
import * as api from "./time-series.api";

export interface TimeSeriesState {
  /** Monitoring point whose series is being inspected. */
  selectedMonitoringPointId: string | null;
  /** Inclusive range filter applied to readings, metrics and deletions. */
  range: ReadingsRangeQuery;
  /** Every quantity recorded in the range, in timestamp order. */
  readings: Reading[];
  /**
   * Quantity the aggregate below describes. `null` lets the first quantity
   * present in the range be chosen, instead of presuming one.
   */
  selectedMetric: MeasurementMetric | null;
  metrics: ReadingsMetrics | null;
  /** Total readings stored by the user across every monitoring point. */
  storedCount: number | null;
  status: LoadStatus;
  isMutating: boolean;
  error: SerializedApiError | null;
  /** Result of the last successful ingest, shown as feedback. */
  lastIngest: InsertReadingsResult | null;
}

const initialState: TimeSeriesState = {
  selectedMonitoringPointId: null,
  range: {},
  readings: [],
  selectedMetric: null,
  metrics: null,
  storedCount: null,
  status: "idle",
  isMutating: false,
  error: null,
  lastIngest: null,
};

/**
 * Loads the series for the selected point, plus the aggregate of one quantity.
 *
 * The readings come back for every quantity, because the page draws one chart
 * per quantity. The aggregate cannot: averaging a temperature with a vibration
 * amplitude is meaningless, so the API requires a metric. When none is
 * selected, the first quantity present in the range is used — which is why the
 * aggregate is requested after the readings rather than beside them.
 */
export const fetchTimeSeries = createAsyncThunk<
  { readings: Reading[]; metrics: ReadingsMetrics | null },
  void,
  ThunkConfig
>("timeSeries/fetch", async (_arg, { getState, rejectWithValue }) => {
  const state = getState();
  const {
    selectedMonitoringPointId: id,
    range,
    selectedMetric,
  } = state.timeSeries;

  if (!id) {
    return rejectWithValue({
      status: 400,
      code: "NO_SELECTION",
      message: "Select a monitoring point first",
    });
  }

  try {
    const token = requireToken(state);
    const readings = await api.listReadings(token, id, range);

    const metric =
      selectedMetric && readings.some((r) => r.metric === selectedMetric)
        ? selectedMetric
        : readings[0]?.metric;

    if (!metric) {
      return { readings, metrics: null };
    }

    return {
      readings,
      metrics: await api.getMetrics(token, id, { ...range, metric }),
    };
  } catch (error) {
    return rejectWithValue(serializeApiError(error));
  }
});

export const fetchStoredCount = createAsyncThunk<number, void, ThunkConfig>(
  "timeSeries/fetchStoredCount",
  async (_arg, { getState, rejectWithValue }) => {
    try {
      const { count } = await api.getStoredCount(requireToken(getState()));
      return count;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const ingestReadings = createAsyncThunk<
  InsertReadingsResult,
  { monitoringPointId: string; input: CreateReadingsInput },
  ThunkConfig
>(
  "timeSeries/ingest",
  async (
    { monitoringPointId, input },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      const result = await api.ingestReadings(
        requireToken(getState()),
        monitoringPointId,
        input,
      );
      await dispatch(fetchTimeSeries());
      await dispatch(fetchStoredCount());
      return result;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const deleteReadings = createAsyncThunk<
  DeleteReadingsResult,
  void,
  ThunkConfig
>(
  "timeSeries/delete",
  async (_arg, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const { selectedMonitoringPointId: id, range } = state.timeSeries;

    if (!id) {
      return rejectWithValue({
        status: 400,
        code: "NO_SELECTION",
        message: "Select a monitoring point first",
      });
    }

    try {
      const result = await api.deleteReadings(requireToken(state), id, range);
      await dispatch(fetchTimeSeries());
      await dispatch(fetchStoredCount());
      return result;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

const timeSeriesSlice = createSlice({
  name: "timeSeries",
  initialState,
  reducers: {
    monitoringPointSelected(state, action: { payload: string | null }) {
      state.selectedMonitoringPointId = action.payload;
      // The previous series must not linger while the new one loads, and the
      // chosen quantity may not even exist on the new point.
      state.readings = [];
      state.metrics = null;
      state.selectedMetric = null;
      state.status = "idle";
      state.error = null;
    },
    metricSelected(state, action: { payload: MeasurementMetric }) {
      state.selectedMetric = action.payload;
    },
    rangeChanged(state, action: { payload: ReadingsRangeQuery }) {
      state.range = action.payload;
    },
    lastIngestDismissed(state) {
      state.lastIngest = null;
    },
    timeSeriesErrorDismissed(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeSeries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTimeSeries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.readings = action.payload.readings;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchTimeSeries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? null;
      })
      .addCase(fetchStoredCount.fulfilled, (state, action) => {
        state.storedCount = action.payload;
      })
      .addCase(ingestReadings.fulfilled, (state, action) => {
        state.isMutating = false;
        state.lastIngest = action.payload;
      })
      .addMatcher(
        isAnyOf(ingestReadings.pending, deleteReadings.pending),
        (state) => {
          state.isMutating = true;
          state.error = null;
        },
      )
      .addMatcher(isAnyOf(deleteReadings.fulfilled), (state) => {
        state.isMutating = false;
      })
      .addMatcher(
        isAnyOf(ingestReadings.rejected, deleteReadings.rejected),
        (state, action) => {
          state.isMutating = false;
          state.error = action.payload ?? null;
        },
      );
  },
});

export const {
  monitoringPointSelected,
  metricSelected,
  rangeChanged,
  lastIngestDismissed,
  timeSeriesErrorDismissed,
} = timeSeriesSlice.actions;
export const timeSeriesReducer = timeSeriesSlice.reducer;

export const selectTimeSeries = (state: RootState): TimeSeriesState =>
  state.timeSeries;

/**
 * The readings split by quantity, in the order the quantities first appear.
 *
 * The page renders one chart per entry: separate axes are what keep a
 * temperature from being read as a vibration amplitude.
 */
export const selectReadingsByMetric = createSelector(
  [(state: RootState) => state.timeSeries.readings],
  (readings) => {
    const groups = new Map<MeasurementMetric, Reading[]>();

    for (const reading of readings) {
      const group = groups.get(reading.metric);
      if (group) {
        group.push(reading);
      } else {
        groups.set(reading.metric, [reading]);
      }
    }

    return [...groups.entries()].map(([metric, items]) => ({
      metric,
      readings: items,
    }));
  },
);
