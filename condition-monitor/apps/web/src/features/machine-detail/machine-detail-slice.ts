import type {
  CreatePositionsRequest,
  InstallSensorRequest,
  MachineDetail,
  MonitoringPoint,
  UpdatePointRequest,
} from '@condition-monitor/shared';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toFailure, type RequestFailure } from '../../api/failure';
import { deleteJson, getJson, patchJson, postJson, putJson } from '../../api/http';
import type { LoadStatus } from '../sectors/sectors-slice';

export interface MachineDetailState {
  detail: MachineDetail | null;
  status: LoadStatus;
  error: string | null;
}

const initialState: MachineDetailState = { detail: null, status: 'idle', error: null };

type Rejects = { rejectValue: RequestFailure };

/** Runs a request and rejects with what the screen shows when it fails. */
function attempt<T>(
  request: () => Promise<T>,
  rejectWithValue: (failure: RequestFailure) => unknown,
) {
  return request().catch((error: unknown) => rejectWithValue(toFailure(error)) as never);
}

export const fetchMachineDetail = createAsyncThunk<MachineDetail, string, Rejects>(
  'machineDetail/fetch',
  (id, { rejectWithValue }) =>
    attempt(() => getJson<MachineDetail>(`/machines/${id}`), rejectWithValue),
);

/**
 * Every change below reloads the machine afterwards: the API decides the order of the
 * points and the counts shown before deleting, so the screen never guesses them.
 */
export const addPositions = createAsyncThunk<
  { items: MonitoringPoint[] },
  { machineId: string } & CreatePositionsRequest,
  Rejects
>('machineDetail/addPositions', ({ machineId, positions }, { rejectWithValue, dispatch }) =>
  attempt(async () => {
    const created = await postJson<{ items: MonitoringPoint[] }>(
      `/machines/${machineId}/monitoring-points`,
      { positions },
    );
    void dispatch(fetchMachineDetail(machineId));
    return created;
  }, rejectWithValue),
);

export const updatePoint = createAsyncThunk<
  MonitoringPoint,
  { machineId: string; pointId: string; changes: UpdatePointRequest },
  Rejects
>('machineDetail/updatePoint', ({ machineId, pointId, changes }, { rejectWithValue, dispatch }) =>
  attempt(async () => {
    const point = await patchJson<MonitoringPoint>(`/monitoring-points/${pointId}`, changes);
    void dispatch(fetchMachineDetail(machineId));
    return point;
  }, rejectWithValue),
);

export const deletePoint = createAsyncThunk<void, { machineId: string; pointId: string }, Rejects>(
  'machineDetail/deletePoint',
  ({ machineId, pointId }, { rejectWithValue, dispatch }) =>
    attempt(async () => {
      await deleteJson(`/monitoring-points/${pointId}`);
      void dispatch(fetchMachineDetail(machineId));
    }, rejectWithValue),
);

export const installSensor = createAsyncThunk<
  MonitoringPoint,
  { machineId: string; pointId: string; body: InstallSensorRequest },
  Rejects
>('machineDetail/installSensor', ({ machineId, pointId, body }, { rejectWithValue, dispatch }) =>
  attempt(async () => {
    const point = await putJson<MonitoringPoint>(`/monitoring-points/${pointId}/sensor`, body);
    void dispatch(fetchMachineDetail(machineId));
    return point;
  }, rejectWithValue),
);

export const removeSensor = createAsyncThunk<void, { machineId: string; pointId: string }, Rejects>(
  'machineDetail/removeSensor',
  ({ machineId, pointId }, { rejectWithValue, dispatch }) =>
    attempt(async () => {
      await deleteJson(`/monitoring-points/${pointId}/sensor`);
      void dispatch(fetchMachineDetail(machineId));
    }, rejectWithValue),
);

export const machineDetailSlice = createSlice({
  name: 'machineDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachineDetail.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        // Another machine: its data must not show while the new one loads.
        if (state.detail?.id !== action.meta.arg) state.detail = null;
      })
      .addCase(fetchMachineDetail.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.detail = action.payload;
      })
      .addCase(fetchMachineDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Could not load the machine.';
      });
  },
});
