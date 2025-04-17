import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Machine {
  id: string;
  name: string;
  type: 'Pump' | 'Fan';
}

interface MachinesState {
  machines: Machine[];
}

const initialState: MachinesState = {
  machines: [],
};

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    addMachine(state, action: PayloadAction<Machine>) {
      state.machines.push(action.payload);
    },
    updateMachine(state, action: PayloadAction<Machine>) {
      const index = state.machines.findIndex((machine) => machine.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
      }
    },
    deleteMachine(state, action: PayloadAction<string>) {
      state.machines = state.machines.filter((machine) => machine.id !== action.payload);
    },
  },
});

export const { addMachine, updateMachine, deleteMachine } = machinesSlice.actions;
export default machinesSlice.reducer;
