import { createSlice } from '@reduxjs/toolkit';

const machinesSlice = createSlice({
  name: 'machines',
  initialState: [],
  reducers: {
    setMachines: (state, action) => {
      return action.payload;
    },
  },
});

export const { setMachines } = machinesSlice.actions;
export default machinesSlice.reducer;
