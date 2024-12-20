import { Machine } from "@/types/machines";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MachinesState {
  machines: Machine[];
}

const initialState: MachinesState = {
  machines: [],
};

const machinesSlice = createSlice({
  name: "machines",
  initialState,
  reducers: {
    /**
     * Adds a new machine to the state.
     * @param state - The current state of machines.
     * @param action - The action containing the new machine to add.
     */
    addMachine: (state, action: PayloadAction<Machine>) => {
      state.machines.push(action.payload);
    },

    /**
     * Deletes a machine from the state by its ID.
     * @param state - The current state of machines.
     * @param action - The action containing the ID of the machine to delete.
     */
    deleteMachine: (state, action: PayloadAction<string>) => {
      state.machines = state.machines.filter(
        (machine) => machine.id !== action.payload,
      );
    },

    /**
     * Updates an existing machine in the state.
     * @param state - The current state of machines.
     * @param action - The action containing the updated machine data.
     */
    updateMachine: (state, action: PayloadAction<Machine>) => {
      const index = state.machines.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.machines[index] = action.payload;
      }
    },
  },
});

export const { addMachine, deleteMachine, updateMachine } =
  machinesSlice.actions;
export default machinesSlice.reducer;
