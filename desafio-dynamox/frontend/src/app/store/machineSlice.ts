import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import{api, MachineData} from '../services/api';
import { data } from 'react-router-dom';

export type MachineType = 'Bomba' | 'Ventilador';

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
  status: 'online' | 'offline' | 'maintenance';
}

interface MachineState {
  machines: Machine[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: MachineState = {
  machines: [
    { id: 'm1', name: 'Bomba Principal', type: 'Bomba', status: 'online' },
    { id: 'm2', name: 'Ventilador Exaustão', type: 'Ventilador', status: 'maintenance' },
  ],
  status: 'idle',
  error: null,
};

export const fetchMachines = createAsyncThunk('machines/fetchMachines', async () => {
  const response = await api.get<MachineData[]>('/machines');
  return response.data.map(m =>({ ...m, status: m.status || 'online' }));
});

export const addNewMachine = createAsyncThunk('machines/addNewMachine', async (newMachine: Omit<MachineData, 'id'>) => {
  const response = await api.post<MachineData>('/machines', newMachine);
  return { ...response.data, status: response.data.status || 'online' };
});

export const updateMachine = createAsyncThunk('machines/updateMachine', async (updatedMachine: Machine) => {
  const {id, ...data} = updatedMachine;
  const response = await api.patch<MachineData>(`/machines/${updatedMachine.id}`, data);
  return { ...response.data, status: response.data.status || 'online' };
});

export const deleteMachine = createAsyncThunk('machines/deleteMachine', async (machineId: string) => {
  await api.delete(`/machines/${machineId}`);
  return machineId;
});

const machineSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.machines = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch machines';
      })
      .addCase(addNewMachine.fulfilled, (state, action) => {
        state.machines.push(action.payload);
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        const index = state.machines.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.machines[index] = action.payload;
        }
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.machines = state.machines.filter(m => m.id !== action.payload);
      });
  },
});

export default machineSlice.reducer;