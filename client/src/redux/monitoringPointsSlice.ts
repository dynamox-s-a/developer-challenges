import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getMonitoringPoints,
  createMonitoringPoint,
} from '../services/monitoringPointService';
import { MonitoringPointInput, MonitoringPointState } from '../types/monitoringPoint';


export const fetchMonitoringPoints = createAsyncThunk(
  'monitoringPoints/fetchAll',
  async (_, { getState }) => {
    const state = getState() as { monitoringPoints: MonitoringPointState };
    const { page, sortBy, order } = state.monitoringPoints;
    const res = await getMonitoringPoints(page, sortBy, order);
    return res.data;
  }
);

export const createPoint = createAsyncThunk(
  'monitoringPoints/create',
  async (data: MonitoringPointInput, { dispatch }) => {
    await createMonitoringPoint(data);
    dispatch(fetchMonitoringPoints());
  }
);

const initialState: MonitoringPointState = {
    points: [],
    loading: false,
    error: null,
    total: 0,
    sortBy: 'name',
    order: 'asc',
    page: 1,
  };
  
const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<string>) {
      state.sortBy = action.payload;
      state.order = state.order === 'asc' ? 'desc' : 'asc';
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.points = action.payload.data;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export const { setSort, setPage } = monitoringPointsSlice.actions;
export default monitoringPointsSlice.reducer;
