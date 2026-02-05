import { MachineType } from "@/shared/machine-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { machine } from "os";

type Machine = {
  id: string,
  name: string,
  type: MachineType
}

type InitialState = {
  machines: Machine[]
}

const initialState: InitialState = {
  machines: []
}



const machineSlice = createSlice({
  name: 'machines',
  initialState,
  reducers:{
    setMachines: (state, {payload} : PayloadAction<Machine[]>) => {
      state.machines = payload;
    },
    resetMachines: (state) =>{
      state.machines = [];
    }
  }
})

export const {setMachines, resetMachines} = machineSlice.actions;

export default machineSlice.reducer;