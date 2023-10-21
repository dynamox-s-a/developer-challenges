import { createSlice } from '@reduxjs/toolkit';

const machineTypesSlice = createSlice({
  name: 'machineTypes',
  initialState: [],
  reducers: {
    setMachineTypes: (state, action) => {
      return action.payload;
    },
  },
});

export const { setMachineTypes } = machineTypesSlice.actions;
export default machineTypesSlice.reducer;
