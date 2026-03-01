import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  MonitoringPointSortBy,
  MonitoringPointWithMachineAndSensor,
  PaginationMetadata,
  PatchMonitoringPointRequest,
} from '@dynamox/types';
import {
  monitoringPointsAPI,
  type CreateMonitoringPointRequest,
  type MonitoringPointsQuery,
} from '../../../api/monitoring-points';
import type { BaseState } from '../../types';
import { extractErrorMessage } from '../../../utils/form-errors';

export interface MonitoringPointsState extends BaseState {
  monitoringPoints: MonitoringPointWithMachineAndSensor[];
  pagination: PaginationMetadata | null;
}

const initialState: MonitoringPointsState = {
  monitoringPoints: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchMonitoringPoints = createAsyncThunk(
  'monitoringPoints/fetch',
  async (params: MonitoringPointsQuery) => {
    const response = await monitoringPointsAPI.getMonitoringPoints(params);
    return response.data;
  }
);

export const createMonitoringPoint = createAsyncThunk(
  'monitoringPoints/create',
  async (data: CreateMonitoringPointRequest, { rejectWithValue }) => {
    try {
      await monitoringPointsAPI.createMonitoringPoint(data);
      return undefined;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Erro ao criar ponto de monitoramento'));
    }
  }
);

export const updateMonitoringPoint = createAsyncThunk(
  'monitoringPoints/update',
  async (
    { uuid, data }: { uuid: string; data: PatchMonitoringPointRequest },
    { rejectWithValue }
  ) => {
    try {
      await monitoringPointsAPI.updateMonitoringPoint(uuid, data);
      return undefined;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, 'Erro ao atualizar ponto de monitoramento')
      );
    }
  }
);

export const deleteMonitoringPoint = createAsyncThunk(
  'monitoringPoints/delete',
  async (uuid: string, { rejectWithValue }) => {
    try {
      await monitoringPointsAPI.deleteMonitoringPoint(uuid);
      return undefined;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Erro ao remover ponto de monitoramento'));
    }
  }
);

export const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monitoringPoints = action.payload.monitoringPoints;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Erro ao carregar pontos de monitoramento';
      });
  },
});

export default monitoringPointsSlice.reducer;

export type { MonitoringPointSortBy };
