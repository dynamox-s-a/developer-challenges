import { createSlice, nanoid } from '@reduxjs/toolkit';
import { Machine } from './machine.types';

const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    ids: [] as string[],
    entities: {} as Record<string, Machine>,
  },
  reducers: {
    addMachine(state, action) {
      const id = nanoid();
      state.entities[id] = { id, ...action.payload };
      state.ids.push(id);
    },

    updateMachine(state, action) {
      const { id, name, type } = action.payload;
      if (state.entities[id]) {
        state.entities[id].name = name;
        state.entities[id].type = type;
      }
    },
  },
});

export const { addMachine, updateMachine } = machinesSlice.actions;
export default machinesSlice.reducer;
