import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MachineType = 'Bomba' | 'Ventilador';

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
  status: 'online' | 'offline' | 'maintenance';
}

interface MachineState {
  machines: Machine[];
}

const initialState: MachineState = {
  machines: [
    { id: 'm1', name: 'Bomba Principal', type: 'Bomba', status: 'online' },
    { id: 'm2', name: 'Ventilador Exaustão', type: 'Ventilador', status: 'maintenance' },
  ],
};

const machineSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    addMachine: (state, action: PayloadAction<Machine>) => {
      state.machines.push(action.payload);
    },
    updateMachine: (state, action: PayloadAction<Machine>) => {
      const index = state.machines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
      }
    },
    deleteMachine: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addMachine, updateMachine, deleteMachine } = machineSlice.actions;
export default machineSlice.reducer;