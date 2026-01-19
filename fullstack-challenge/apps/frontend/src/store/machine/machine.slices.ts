import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { Machine } from './machine.types';

const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    ids: [] as string[],
    entities: {} as Record<string, Machine>,
  },
  reducers: {
    addMachine(state, action) {
      if (state.ids.length >= 4) {
        return;
      }

      const id = nanoid();
      state.entities[id] = { id, ...action.payload };
      state.ids.push(id);
    },

    updateMachine(state, action: PayloadAction<Machine>) {
      const { id, name, type } = action.payload;
      if (state.entities[id]) {
        state.entities[id].name = name;
        state.entities[id].type = type;
      }
    },

    deleteMachine(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter((machineId) => machineId !== id);
    },
  },
});

export const { addMachine, updateMachine, deleteMachine } =
  machinesSlice.actions;

export default machinesSlice.reducer;
