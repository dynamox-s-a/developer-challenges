import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Sensor {
  id: number;
  name: string;
  type: string;
  asset: {
    id: number;
    name: string;
    type: string;
  };
}

interface SensorsState {
  sensors: Sensor[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SensorsState = {
  sensors: [],
  status: 'idle',
  error: null,
};

export const fetchSensors = createAsyncThunk('sensors/fetchSensors', async () => {
  const response = await fetch('http://localhost:3001/sensor/show');
  if (!response.ok) {
    throw new Error('Failed to fetch sensors');
  }
  const data = await response.json();
  return data;
});

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSensors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sensors = action.payload;
      })
      .addCase(fetchSensors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default sensorsSlice.reducer;

export type SensorsStateType = SensorsState;
