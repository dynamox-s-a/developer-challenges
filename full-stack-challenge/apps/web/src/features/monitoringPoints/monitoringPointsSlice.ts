import type {
  MonitoringPointListItemDto,
  PaginationMeta,
} from '@dynapredict/shared-types';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { RequestStatus } from '../../app/requestStatus';
import type { RootState } from '../../app/rootReducer';
import { type ApiError, toApiError } from '../../services/apiClient';
import * as monitoringPointsApi from '../../services/monitoringPointsApi';
import type { MonitoringPointsQuery } from '../../services/monitoringPointsApi';
import { logout, sessionExpired } from '../auth/authSlice';

export interface MonitoringPointsState {
  rows: MonitoringPointListItemDto[];
  meta: PaginationMeta | null;
  query: MonitoringPointsQuery;
  status: RequestStatus;
  error: ApiError | null;
  latestRequestId: string | null;
}

/** The challenge asks for 5 rows per page; the API defaults to it too. */
export const DEFAULT_MONITORING_POINTS_QUERY: MonitoringPointsQuery = {
  page: 1,
  pageSize: 5,
  sortBy: 'machineName',
  sortDir: 'asc',
};

const initialState: MonitoringPointsState = {
  rows: [],
  meta: null,
  query: DEFAULT_MONITORING_POINTS_QUERY,
  status: 'idle',
  error: null,
  latestRequestId: null,
};

/** Loads the page described by `state.monitoringPoints.query`. */
export const fetchMonitoringPoints = createAsyncThunk<
  Awaited<ReturnType<typeof monitoringPointsApi.listMonitoringPoints>>,
  void,
  { state: RootState; rejectValue: ApiError }
>('monitoringPoints/fetch', async (_, { getState, rejectWithValue }) => {
  try {
    return await monitoringPointsApi.listMonitoringPoints(
      getState().monitoringPoints.query,
    );
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {
    pageChanged(state, action: PayloadAction<number>) {
      state.query.page = action.payload;
    },
    /** A new size or sort starts again from the first page. */
    pageSizeChanged(state, action: PayloadAction<number>) {
      state.query.pageSize = action.payload;
      state.query.page = 1;
    },
    sortChanged(
      state,
      action: PayloadAction<Pick<MonitoringPointsQuery, 'sortBy' | 'sortDir'>>,
    ) {
      state.query.sortBy = action.payload.sortBy;
      state.query.sortDir = action.payload.sortDir;
      state.query.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.latestRequestId = action.meta.requestId;
      })
      // Only the latest request may write: an older, slower page must not
      // replace the one the user asked for last.
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.status = 'succeeded';
        state.rows = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.status = 'failed';
        state.error = action.payload ?? toApiError(action.error);
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const { pageChanged, pageSizeChanged, sortChanged } =
  monitoringPointsSlice.actions;
export const monitoringPointsReducer = monitoringPointsSlice.reducer;
