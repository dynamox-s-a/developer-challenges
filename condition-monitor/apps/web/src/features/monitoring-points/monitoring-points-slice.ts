import type { MonitoringPoint, Page, PointSortKey, SortOrder } from '@condition-monitor/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { getJson } from '../../api/http';
import type { LoadStatus } from '../sectors/sectors-slice';

export interface PointsQuery {
  page: number;
  pageSize: number;
  sort: PointSortKey;
  order: SortOrder;
}

/** The challenge list: 5 points per page, sorted by machine name. */
export const DEFAULT_POINTS_QUERY: PointsQuery = {
  page: 1,
  pageSize: 5,
  sort: 'machineName',
  order: 'asc',
};

export interface MonitoringPointsState {
  query: PointsQuery;
  page: Page<MonitoringPoint> | null;
  status: LoadStatus;
  error: string | null;
}

const initialState: MonitoringPointsState = {
  query: DEFAULT_POINTS_QUERY,
  page: null,
  status: 'idle',
  error: null,
};

/** Query string in a fixed parameter order, so the same query is always the same URL. */
export function pointsPath({ page, pageSize, sort, order }: PointsQuery): string {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort,
    order,
  });
  return `/monitoring-points?${params.toString()}`;
}

/** Sorting and paging happen on the server, which sees every point, not one page. */
export const fetchPoints = createAsyncThunk<
  Page<MonitoringPoint>,
  PointsQuery,
  { rejectValue: RequestFailure }
>('monitoringPoints/fetch', async (query, { rejectWithValue }) => {
  try {
    return await getJson<Page<MonitoringPoint>>(pointsPath(query));
  } catch (error) {
    return rejectWithValue(toFailure(error));
  }
});

export const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoints.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.query = action.meta.arg;
      })
      .addCase(fetchPoints.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.page = action.payload;
      })
      .addCase(fetchPoints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Could not load the monitoring points.';
      });
  },
});
