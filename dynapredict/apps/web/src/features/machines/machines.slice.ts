import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { MachineInput } from '@dynapredict/shared';
import { api, getApiErrorMessage } from '../../lib/api-client';
import { logout } from '../auth/auth.slice';

// Uma máquina como a API devolve. No JSON as datas chegam como texto (ISO)
export type Machine = MachineInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type MachinesState = {
  items: Machine[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: MachinesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchMachines = createAsyncThunk<
  Machine[],
  void,
  { rejectValue: string }
>('machines/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<Machine[]>('/machines');
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Erro inesperado';
      })
      // Saiu do sistema? Esquece as máquinas (o próximo login busca de novo)
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const machinesReducer = machinesSlice.reducer;
