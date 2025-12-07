import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export interface Machine {
  id: string;
  name: string;
  type: 'Bomba' | 'Ventilador';
}

interface MachinesState {
  items: Machine[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MachinesState = {
  items: [],
  status: 'idle',
};

export const fetchMachines = createAsyncThunk('machines/fetchMachines', async () => {
  const response = await api.get('/machines');
  return response.data;
});

export const createMachine = createAsyncThunk('machines/createMachine', async (newMachine: { name: string; type: string }) => {
  const response = await api.post('/machines', newMachine);
  return response.data;
});

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Quando começar a buscar
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
      })
      // Quando terminar com sucesso
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      // Quando criar uma nova, adiciona na lista local
      .addCase(createMachine.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default machinesSlice.reducer;