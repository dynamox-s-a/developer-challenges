import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MachineType } from 'utils/constants';
import humps from 'humps';
import { MonitoringPont } from './monitoring-points-slice';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Machine {
  id: number;
  name: string;
  type: MachineType;
  monitoringPoints: MonitoringPont[];
}

const INITIAL_STATE: { machines: Machine[] } = {
  machines: [],
};

export const addMachine = createAsyncThunk(
  'addMachine',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state?.user?.accessToken;

      const response = await fetch(`${API_URL}/machines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authentication: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
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

export const getMachines = createAsyncThunk(
  'getMachines',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const accessToken = state?.user?.accessToken;

      const response = await fetch(
        `${API_URL}/machines?_embed=monitoring-points`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            Authentication: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.status >= 400) {
        throw rejectWithValue(data);
      }

      return humps.camelizeKeys(data);
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const editMachine = createAsyncThunk(
  'editMachine',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state?.user?.accessToken;

      const { id, ...restPayload } = payload;

      const response = await fetch(`${API_URL}/machines/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authentication: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(restPayload),
      });

      const data = await response.json();
      if (response.status >= 400) {
        throw rejectWithValue(data);
      }

      return humps.camelizeKeys(data);
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const deleteMachine = createAsyncThunk(
  'deleteMachine',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state?.user?.accessToken;

      const response = await fetch(`${API_URL}/machines/${payload}`, {
        method: 'DELETE',
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

      return humps.camelizeKeys(data);
    } catch (err) {
      const error = err as { response?: any };

      if (!('response' in error)) {
        throw err;
      }

      rejectWithValue(error?.response.data);
    }
  }
);

export const machineSlice = createSlice({
  name: 'machine',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addMachine.fulfilled, (state, { payload }) => {
      state.machines.push(payload);
    });
    builder.addCase(getMachines.fulfilled, (state, { payload }) => {
      state.machines = payload;
    });
    builder.addCase(editMachine.fulfilled, (state, { payload }) => {
      const currentMachineIndex = state.machines.findIndex(
        (machine) => machine.id === payload.id
      );

      state.machines[currentMachineIndex] = payload;
    });
    builder.addCase(deleteMachine.fulfilled, (state, { meta }) => {
      const deletedId = meta.arg;

      const newMachines = state.machines.filter(
        (machine) => Number(machine.id) !== deletedId
      );

      state.machines = newMachines;
    });
  },
});

export default machineSlice.reducer;
