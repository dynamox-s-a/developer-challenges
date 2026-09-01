import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { MachineType } from '@dynamox/domain';

import { api, type MachineDto } from '../../api/client';
import type { RootState } from '../../store';
import type { RequestStatus } from '../../store/requestStatus';

export interface MachinesState {
  items: MachineDto[];
  listStatus: RequestStatus;
  listError: string | null;
  createStatus: RequestStatus;
  createError: string | null;
  updateStatus: RequestStatus;
  updateError: string | null;
  deleteStatus: RequestStatus;
  deleteError: string | null;
}

export const initialMachinesState: MachinesState = {
  items: [],
  listStatus: 'idle',
  listError: null,
  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
  deleteStatus: 'idle',
  deleteError: null,
};

/** Mesma ordenação da API (por nome), para a lista local não divergir do servidor. */
const byName = (a: MachineDto, b: MachineDto): number => a.name.localeCompare(b.name, 'pt-BR');

export const fetchMachines = createAsyncThunk('machines/fetch', async () => api.machines());

export const createMachine = createAsyncThunk(
  'machines/create',
  async (input: { name: string; type: MachineType }) =>
    api.createMachine(input.name, input.type),
);

export const updateMachine = createAsyncThunk(
  'machines/update',
  async (input: { id: string; changes: { name?: string; type?: MachineType } }) =>
    api.updateMachine(input.id, input.changes),
);

export const deleteMachine = createAsyncThunk('machines/delete', async (id: string) => {
  await api.deleteMachine(id);
  return id;
});

const machinesSlice = createSlice({
  name: 'machines',
  initialState: initialMachinesState,
  reducers: {
    createErrorDismissed(state) {
      state.createError = null;
      if (state.createStatus === 'failed') state.createStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = [...action.payload].sort(byName);
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.error.message ?? 'Não foi possível carregar as máquinas.';
      })

      .addCase(createMachine.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.createError = null;
        // Nada de item otimista: só entra na lista o registro devolvido pela API.
        state.items = [...state.items, action.payload].sort(byName);
      })
      .addCase(createMachine.rejected, (state, action) => {
        // A lista já carregada é preservada: falhar ao cadastrar não pode esvaziar a tela.
        state.createStatus = 'failed';
        state.createError = action.error.message ?? 'Não foi possível cadastrar a máquina.';
      })

      .addCase(updateMachine.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateMachine.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        // Substitui pelo registro devolvido pela API (nunca pelo que foi digitado) e
        // reordena: a edição de nome pode mudar a posição na lista.
        state.items = state.items
          .map((machine) => (machine.id === action.payload.id ? action.payload : machine))
          .sort(byName);
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.error.message ?? 'Não foi possível editar a máquina.';
      })

      .addCase(deleteMachine.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.items = state.items.filter((machine) => machine.id !== action.payload);
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.error.message ?? 'Não foi possível excluir a máquina.';
      });
  },
});

export const { createErrorDismissed } = machinesSlice.actions;
export const machinesReducer = machinesSlice.reducer;

export const selectMachines = (state: RootState): MachinesState => state.machines;
