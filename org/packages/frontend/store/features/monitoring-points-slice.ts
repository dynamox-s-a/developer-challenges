import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SensorModel } from 'utils/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface MonitoringPont {
  id: number | string;
  name: string;
  sensorModel: SensorModel;
  machineId: number;
}

const INITIAL_STATE: { monitoringPoints: MonitoringPont[] } = {
  monitoringPoints: [],
};

export const getMonitoringPoints = createAsyncThunk(
  'getMonitoringPoints',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state?.user?.accessToken;

      console.log('accessToken', accessToken);
      const response = await fetch(`${API_URL}/machines`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authentication: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (response.status >= 400) {
        throw rejectWithValue(data);
      }

      return data;
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const createMonitoringPoint = createAsyncThunk(
  'createMonitoringPoint',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state?.user?.accessToken;

      const { machineId, ...restPayload } = payload;

      const newPayload = {
        ...restPayload,
        machineId: Number(machineId),
      };

      console.log('newPayload', newPayload);
      const response = await fetch(
        `${API_URL}/machines/${Number(machineId)}/monitoring-points`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            Authentication: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newPayload),
        }
      );

      const data = await response.json();
      if (response.status >= 400) {
        throw rejectWithValue(data);
      }

      return data;
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const monitoringPointSlice = createSlice({
  name: 'monitoringPoint',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMonitoringPoints.fulfilled, (state, { payload }) => {
      state.monitoringPoints = payload;
    });
    builder.addCase(createMonitoringPoint.fulfilled, (state, { payload }) => {
      state.monitoringPoints.push(payload);
    });
  },
});

export default monitoringPointSlice.reducer;
