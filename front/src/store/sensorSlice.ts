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

export const registerSensor = createAsyncThunk(
  'sensors/register',
  async ({ name, type, assetId }: { name: string; type: string; assetId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3001/sensor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type, assetId }),
      });

      if (!response.ok) {
        throw new Error('Failed to register sensor');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to register sensor');
    }
  }
);

export const deleteSensor = createAsyncThunk(
  'sensors/delete',
  async (sensorId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/sensor/delete/${sensorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete sensor');
      }

      return sensorId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete sensor');
    }
  }
);

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
      })
      .addCase(registerSensor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sensors.push(action.payload);
      })
      .addCase(registerSensor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to register sensor';
      })
      .addCase(deleteSensor.fulfilled, (state, action) => {
        state.sensors = state.sensors.filter(sensor => sensor.id !== action.payload);
      })
      .addCase(deleteSensor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete sensor';
      });
  },
});

export default sensorsSlice.reducer;

export type SensorsStateType = SensorsState;
