import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  AssociateSensorRequest,
  CreateMonitoringPointRequest,
  ListMonitoringPointsParams,
  MonitoringPointDto,
  MonitoringPointSortField,
  PaginatedResponse,
  SortOrder,
} from '@dynamox/shared';
import { monitoringPointsApi } from '../../services/api';
import { ApiClientError } from '../../services/apiClient';

interface MonitoringPointsState {
  items: MonitoringPointDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sortBy: MonitoringPointSortField;
  order: SortOrder;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MonitoringPointsState = {
  items: [],
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 1,
  sortBy: 'name',
  order: 'asc',
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
};

export const fetchMonitoringPoints = createAsyncThunk(
  'monitoringPoints/fetchAll',
  async (params: ListMonitoringPointsParams | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { monitoringPoints: MonitoringPointsState };
      const query: ListMonitoringPointsParams = {
        page: params?.page ?? state.monitoringPoints.page,
        limit: params?.limit ?? state.monitoringPoints.limit,
        sortBy: params?.sortBy ?? state.monitoringPoints.sortBy,
        order: params?.order ?? state.monitoringPoints.order,
      };
      return await monitoringPointsApi.list(query);
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to load monitoring points');
    }
  }
);

export const createMonitoringPoint = createAsyncThunk(
  'monitoringPoints/create',
  async (
    { machineId, payload }: { machineId: string; payload: CreateMonitoringPointRequest },
    { rejectWithValue }
  ) => {
    try {
      return await monitoringPointsApi.create(machineId, payload);
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to create monitoring point');
    }
  }
);

export const associateSensor = createAsyncThunk(
  'monitoringPoints/associateSensor',
  async (
    { pointId, payload }: { pointId: string; payload: AssociateSensorRequest },
    { rejectWithValue }
  ) => {
    try {
      return await monitoringPointsApi.associateSensor(pointId, payload);
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to associate sensor');
    }
  }
);

export const deleteMonitoringPoint = createAsyncThunk(
  'monitoringPoints/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await monitoringPointsApi.remove(id);
      return id;
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to delete monitoring point');
    }
  }
);

export const removeSensor = createAsyncThunk(
  'monitoringPoints/removeSensor',
  async (pointId: string, { rejectWithValue }) => {
    try {
      await monitoringPointsApi.removeSensor(pointId);
      return pointId;
    } catch (error) {
      if (error instanceof ApiClientError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unable to remove sensor');
    }
  }
);

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {
    clearMonitoringPointsError(state) {
      state.error = null;
    },
    setMonitoringPointsPage(state, action: { payload: number }) {
      state.page = action.payload;
    },
    setMonitoringPointsSort(
      state,
      action: { payload: { sortBy: MonitoringPointSortField; order: SortOrder } }
    ) {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchMonitoringPoints.fulfilled,
        (state, action: { payload: PaginatedResponse<MonitoringPointDto> }) => {
          state.status = 'succeeded';
          state.items = action.payload.data;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.total = action.payload.total;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load monitoring points';
      })
      .addCase(createMonitoringPoint.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(createMonitoringPoint.fulfilled, (state) => {
        state.mutationStatus = 'succeeded';
      })
      .addCase(createMonitoringPoint.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = (action.payload as string) ?? 'Failed to create monitoring point';
      })
      .addCase(associateSensor.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(associateSensor.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(associateSensor.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = (action.payload as string) ?? 'Failed to associate sensor';
      })
      .addCase(deleteMonitoringPoint.pending, (state) => {
        state.mutationStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteMonitoringPoint.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteMonitoringPoint.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = (action.payload as string) ?? 'Failed to delete monitoring point';
      })
      .addCase(removeSensor.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.map((item) =>
          item.id === action.payload
            ? { ...item, sensorId: null, sensorModel: null }
            : item
        );
      })
      .addCase(removeSensor.rejected, (state, action) => {
        state.mutationStatus = 'failed';
        state.error = (action.payload as string) ?? 'Failed to remove sensor';
      });
  },
});

export const {
  clearMonitoringPointsError,
  setMonitoringPointsPage,
  setMonitoringPointsSort,
} = monitoringPointsSlice.actions;

export default monitoringPointsSlice.reducer;
