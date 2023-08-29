import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MachineType } from 'utils/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
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

      console.log('accessToken', accessToken);
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

export const editMachine = createAsyncThunk(
  'editMachine',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state?.user?.accessToken;

      const { id, ...restPayload } = payload;

      console.log('id', id);
      console.log('restPayload', restPayload);
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
      console.log('edit machine payload', payload);
      const currentMachineIndex = state.machines.findIndex(
        (machine) => machine.id === payload.id
      );

      state.machines[currentMachineIndex] = payload;
    });
  },
});

export default machineSlice.reducer;
