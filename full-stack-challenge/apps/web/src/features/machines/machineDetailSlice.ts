import type { MachineDetailDto, SensorInput } from '@dynapredict/shared-types';
import {
  type AsyncThunkPayloadCreator,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import type { RequestStatus } from '../../app/requestStatus';
import type { RootState } from '../../app/rootReducer';
import { type ApiError, toApiError } from '../../services/apiClient';
import * as machinesApi from '../../services/machinesApi';
import * as monitoringPointsApi from '../../services/monitoringPointsApi';
import * as sensorsApi from '../../services/sensorsApi';
import { logout, sessionExpired } from '../auth/authSlice';

export interface MachineDetailState {
  machine: MachineDetailDto | null;
  status: RequestStatus;
  error: ApiError | null;
  latestRequestId: string | null;
}

const initialState: MachineDetailState = {
  machine: null,
  status: 'idle',
  error: null,
  latestRequestId: null,
};

type ThunkConfig = { state: RootState; rejectValue: ApiError };

export const fetchMachineDetail = createAsyncThunk<
  MachineDetailDto,
  string,
  ThunkConfig
>('machineDetail/fetch', async (id, { rejectWithValue }) => {
  try {
    return await machinesApi.getMachine(id);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/**
 * Wraps a point or sensor mutation: run it, then reload the machine so the
 * page shows what the server stored (names trimmed, sensor ids, order). A
 * failed reload doesn't fail the mutation, which did happen.
 */
function mutation<Arg>(type: string, run: (arg: Arg) => Promise<unknown>) {
  const payloadCreator: AsyncThunkPayloadCreator<
    void,
    Arg,
    ThunkConfig
  > = async (arg, { dispatch, getState, rejectWithValue }) => {
    try {
      await run(arg);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
    const machineId = getState().machineDetail.machine?.id;
    if (machineId) await dispatch(fetchMachineDetail(machineId));
    return undefined;
  };
  return createAsyncThunk<void, Arg, ThunkConfig>(type, payloadCreator);
}

export const createPoint = mutation(
  'machineDetail/createPoint',
  ({ machineId, name }: { machineId: string; name: string }) =>
    monitoringPointsApi.createMonitoringPoint(machineId, { name }),
);

export const renamePoint = mutation(
  'machineDetail/renamePoint',
  ({ pointId, name }: { pointId: string; name: string }) =>
    monitoringPointsApi.renameMonitoringPoint(pointId, { name }),
);

export const deletePoint = mutation(
  'machineDetail/deletePoint',
  (pointId: string) => monitoringPointsApi.deleteMonitoringPoint(pointId),
);

export const attachSensor = mutation(
  'machineDetail/attachSensor',
  ({ pointId, input }: { pointId: string; input: SensorInput }) =>
    sensorsApi.attachSensor(pointId, input),
);

export const removeSensor = mutation(
  'machineDetail/removeSensor',
  (sensorId: string) => sensorsApi.removeSensor(sensorId),
);

const machineDetailSlice = createSlice({
  name: 'machineDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachineDetail.pending, (state, action) => {
        // Opening another machine must not show the previous one meanwhile;
        // reloading the same one keeps it on screen.
        if (state.machine?.id !== action.meta.arg) state.machine = null;
        state.status = 'loading';
        state.error = null;
        state.latestRequestId = action.meta.requestId;
      })
      .addCase(fetchMachineDetail.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.status = 'succeeded';
        state.machine = action.payload;
      })
      .addCase(fetchMachineDetail.rejected, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.status = 'failed';
        state.error = action.payload ?? toApiError(action.error);
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const machineDetailReducer = machineDetailSlice.reducer;
