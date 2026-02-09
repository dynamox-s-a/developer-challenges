import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';

export interface Sensor {
  id?: string;
  model: string;
}

export interface MonitoringPoint {
  id?: number;
  name: string;
  sensor?: Sensor;
}

export interface Machine {
  id: number;
  name: string;
  type: string;
  monitoringPoints: MonitoringPoint[];
}

interface MachinesState {
  items: Machine[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MachinesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchMachines = createAsyncThunk('machines/fetchMachines', async () => {
  const response = await api.get('/machines');
  return response.data;
});

export const createMachine = createAsyncThunk(
  'machines/createMachine',
  async (data: { name: string; type: string; monitoringPoints: MonitoringPoint[] }) => {
    const response = await api.post('/machines', data);
    return response.data;
  },
);

export const updateMachine = createAsyncThunk(
  'machines/updateMachine',
  async ({ id, data }: { id: number; data: { name?: string; type?: string; monitoringPoints?: MonitoringPoint[] } }) => {
    const response = await api.patch(`/machines/${id}`, data);
    return response.data;
  },
);

export const deleteMachine = createAsyncThunk('machines/deleteMachine', async (id: number) => {
  await api.delete(`/machines/${id}`);
  return id;
});

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch machines';
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default machinesSlice.reducer;
