import type { Machine } from '@repo/contracts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RequestStatus } from '../types';

export type MachinesState = {
  items: Machine[];
  selectedId: string | null;
  status: RequestStatus;
  error: string | null;
};

const initialState: MachinesState = {
  items: [],
  selectedId: null,
  status: 'idle',
  error: null,
};

export const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    fetchMachines: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchMachinesSucceeded: (state, action: PayloadAction<Machine[]>) => {
      state.status = 'succeeded';
      state.items = action.payload;

      const isSelectionValid = action.payload.some((machine) => machine.id === state.selectedId);

      state.selectedId = isSelectionValid ? state.selectedId : (action.payload[0]?.id ?? null);
    },
    fetchMachinesFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    machineSelected: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
});

export const { fetchMachines, fetchMachinesSucceeded, fetchMachinesFailed, machineSelected } =
  machinesSlice.actions;
