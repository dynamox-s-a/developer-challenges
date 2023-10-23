import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const machinesSlice = createSlice({
  name: 'machines',
  initialState: [],
  reducers: {
    setMachines: (state, action) => {
      return action.payload;
    },
    updateMachine: (state: any[], action) => {
      const { id, name, sector, machine_type_selected } = action.payload;
      const machineToUpdate = state.find((machine) => machine.id === id);
      if (machineToUpdate) {
        machineToUpdate.name = name;
        machineToUpdate.sector = sector;
        machineToUpdate.machine_type_selected = machine_type_selected;
      }
    },
  },
});

export const { setMachines, updateMachine } = machinesSlice.actions;

export const selectMachines = (state:any) => state.machines;

export default machinesSlice.reducer;
