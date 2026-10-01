import type { Overview } from '@condition-monitor/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { getJson } from '../../api/http';
import type { LoadStatus } from '../sectors/sectors-slice';

export interface OverviewState {
  counts: Overview | null;
  status: LoadStatus;
  error: string | null;
}

const initialState: OverviewState = { counts: null, status: 'idle', error: null };

/** The counts of the user, read again on every visit: imports change them. */
export const fetchOverview = createAsyncThunk<Overview, void, { rejectValue: RequestFailure }>(
  'overview/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getJson<Overview>('/overview');
    } catch (error) {
      return rejectWithValue(toFailure(error));
    }
  },
);

export const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.counts = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Could not load the overview.';
      });
  },
});
