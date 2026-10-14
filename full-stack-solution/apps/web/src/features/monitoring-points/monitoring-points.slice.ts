import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  MONITORING_POINTS_PAGE_SIZE,
  type AssignSensorInput,
  type CreateMonitoringPointInput,
  type ListMonitoringPointsQuery,
  type MonitoringPoint,
  type MonitoringPointSortField,
  type Paginated,
  type SortOrder,
  type UpdateMonitoringPointInput,
} from "@full-stack-solution/shared";
import { serializeApiError, type SerializedApiError } from "@web/api/api-error";
import { requireToken } from "@web/app/require-token";
import type { RootState } from "@web/app/store";
import type { ThunkConfig } from "@web/app/thunk";
import { fetchMachines } from "@web/features/machines/machines.slice";
import type { LoadStatus } from "@web/features/machines/machines.slice";
import * as api from "./monitoring-points.api";

export interface MonitoringPointsState {
  items: MonitoringPoint[];
  /**
   * Every monitoring point, independent of the paginated view.
   * Needed by the pickers (time series, dialogs), which cannot work with a
   * single page of results.
   */
  all: MonitoringPoint[];
  total: number;
  /** Current server-side pagination and sorting, mirrored in the UI controls. */
  query: ListMonitoringPointsQuery;
  status: LoadStatus;
  isMutating: boolean;
  error: SerializedApiError | null;
}

const initialState: MonitoringPointsState = {
  items: [],
  all: [],
  total: 0,
  query: {
    page: 1,
    pageSize: MONITORING_POINTS_PAGE_SIZE,
    sortBy: "machineName",
    order: "asc",
  },
  status: "idle",
  isMutating: false,
  error: null,
};

export const fetchMonitoringPoints = createAsyncThunk<
  Paginated<MonitoringPoint>,
  void,
  ThunkConfig
>("monitoringPoints/fetch", async (_arg, { getState, rejectWithValue }) => {
  const state = getState();
  try {
    return await api.listMonitoringPoints(
      requireToken(state),
      state.monitoringPoints.query,
    );
  } catch (error) {
    return rejectWithValue(serializeApiError(error));
  }
});

/**
 * Loads all monitoring points for the selection controls.
 *
 * `pageSize` is capped at 50 by the API; that is well above the number of
 * points this challenge deals with, and pagination would add a loop that buys
 * nothing here.
 */
export const fetchAllMonitoringPoints = createAsyncThunk<
  MonitoringPoint[],
  void,
  ThunkConfig
>("monitoringPoints/fetchAll", async (_arg, { getState, rejectWithValue }) => {
  try {
    const { data } = await api.listMonitoringPoints(requireToken(getState()), {
      page: 1,
      pageSize: 50,
      sortBy: "machineName",
      order: "asc",
    });
    return data;
  } catch (error) {
    return rejectWithValue(serializeApiError(error));
  }
});

export const createMonitoringPoint = createAsyncThunk<
  MonitoringPoint,
  { machineId: string; input: CreateMonitoringPointInput },
  ThunkConfig
>(
  "monitoringPoints/create",
  async ({ machineId, input }, { dispatch, getState, rejectWithValue }) => {
    try {
      const created = await api.createMonitoringPoint(
        requireToken(getState()),
        machineId,
        input,
      );
      // The list is paginated and sorted on the server, so a local insert could
      // place the row on the wrong page: refetch instead.
      await dispatch(fetchMonitoringPoints());
      await dispatch(fetchAllMonitoringPoints());
      await dispatch(fetchMachines());
      return created;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const renameMonitoringPoint = createAsyncThunk<
  MonitoringPoint,
  { id: string; input: UpdateMonitoringPointInput },
  ThunkConfig
>(
  "monitoringPoints/rename",
  async ({ id, input }, { dispatch, getState, rejectWithValue }) => {
    try {
      const updated = await api.updateMonitoringPoint(
        requireToken(getState()),
        id,
        input,
      );
      await dispatch(fetchMonitoringPoints());
      await dispatch(fetchAllMonitoringPoints());
      return updated;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const deleteMonitoringPoint = createAsyncThunk<
  string,
  string,
  ThunkConfig
>(
  "monitoringPoints/delete",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await api.deleteMonitoringPoint(requireToken(getState()), id);
      await dispatch(fetchMonitoringPoints());
      await dispatch(fetchAllMonitoringPoints());
      await dispatch(fetchMachines());
      return id;
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const assignSensor = createAsyncThunk<
  void,
  { monitoringPointId: string; input: AssignSensorInput },
  ThunkConfig
>(
  "monitoringPoints/assignSensor",
  async (
    { monitoringPointId, input },
    { dispatch, getState, rejectWithValue },
  ) => {
    try {
      await api.assignSensor(requireToken(getState()), monitoringPointId, input);
      await dispatch(fetchMonitoringPoints());
      await dispatch(fetchAllMonitoringPoints());
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

export const removeSensor = createAsyncThunk<void, string, ThunkConfig>(
  "monitoringPoints/removeSensor",
  async (monitoringPointId, { dispatch, getState, rejectWithValue }) => {
    try {
      await api.removeSensor(requireToken(getState()), monitoringPointId);
      await dispatch(fetchMonitoringPoints());
      await dispatch(fetchAllMonitoringPoints());
    } catch (error) {
      return rejectWithValue(serializeApiError(error));
    }
  },
);

const monitoringPointsSlice = createSlice({
  name: "monitoringPoints",
  initialState,
  reducers: {
    /** Zero-based page index, matching MUI's `TablePagination`. */
    pageChanged(state, action: { payload: number }) {
      state.query.page = action.payload + 1;
    },
    pageSizeChanged(state, action: { payload: number }) {
      state.query.pageSize = action.payload;
      state.query.page = 1;
    },
    /**
     * Clicking the active column flips the direction; a new column starts
     * ascending. Changing the order always returns to the first page.
     */
    sortChanged(state, action: { payload: MonitoringPointSortField }) {
      const field = action.payload;
      const nextOrder: SortOrder =
        state.query.sortBy === field && state.query.order === "asc"
          ? "desc"
          : "asc";
      state.query.sortBy = field;
      state.query.order = nextOrder;
      state.query.page = 1;
    },
    monitoringPointsErrorDismissed(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.total = action.payload.total;
        // Keep the UI controls in sync with the page the server actually served.
        state.query.page = action.payload.page;
        state.query.pageSize = action.payload.pageSize;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? null;
      })
      .addCase(fetchAllMonitoringPoints.fulfilled, (state, action) => {
        state.all = action.payload;
      })
      .addMatcher(
        isAnyOf(
          createMonitoringPoint.pending,
          renameMonitoringPoint.pending,
          deleteMonitoringPoint.pending,
          assignSensor.pending,
          removeSensor.pending,
        ),
        (state) => {
          state.isMutating = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          createMonitoringPoint.fulfilled,
          renameMonitoringPoint.fulfilled,
          deleteMonitoringPoint.fulfilled,
          assignSensor.fulfilled,
          removeSensor.fulfilled,
        ),
        (state) => {
          state.isMutating = false;
        },
      )
      .addMatcher(
        isAnyOf(
          createMonitoringPoint.rejected,
          renameMonitoringPoint.rejected,
          deleteMonitoringPoint.rejected,
          assignSensor.rejected,
          removeSensor.rejected,
        ),
        (state, action) => {
          state.isMutating = false;
          state.error = action.payload ?? null;
        },
      );
  },
});

export const {
  pageChanged,
  pageSizeChanged,
  sortChanged,
  monitoringPointsErrorDismissed,
} = monitoringPointsSlice.actions;
export const monitoringPointsReducer = monitoringPointsSlice.reducer;

export const selectMonitoringPointsState = (
  state: RootState,
): MonitoringPointsState => state.monitoringPoints;
