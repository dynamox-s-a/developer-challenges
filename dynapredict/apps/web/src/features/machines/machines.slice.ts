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

export const createMachine = createAsyncThunk<
  Machine,
  MachineInput,
  { rejectValue: string }
>('machines/create', async (input, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Machine>('/machines', input);
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// Recebe o id e os campos novos juntos: { id, name, type }
export const updateMachine = createAsyncThunk<
  Machine,
  MachineInput & { id: string },
  { rejectValue: string }
>('machines/update', async ({ id, ...input }, { rejectWithValue }) => {
  try {
    const { data } = await api.put<Machine>(`/machines/${id}`, input);
    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

// A API responde 204 (sem corpo). O thunk devolve o próprio id,
// para o reducer saber qual máquina tirar da lista
export const deleteMachine = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('machines/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/machines/${id}`);
    return id;
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
      // A lista vem da mais nova para a mais antiga: a nova entra no topo
      .addCase(createMachine.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Troca a versão antiga da máquina pela que a API devolveu
      .addCase(updateMachine.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (machine) => machine.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Fica com todas, menos a que foi excluída
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (machine) => machine.id !== action.payload,
        );
      })

      // Saiu do sistema? Esquece as máquinas (o próximo login busca de novo)
      .addCase(logout.fulfilled, () => initialState);
  },
});

export const machinesReducer = machinesSlice.reducer;
