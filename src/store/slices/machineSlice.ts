import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MachineJsonData {
  title: string;
  description: string;
  helper: string;
}

export interface MachineItem extends MachineJsonData {
  type: 'machine' | 'location' | 'rpm' | 'duration' | 'interval';
}

interface MachinesSliceState {
  data: MachineItem[],
  isLoading: boolean
}

const initialState: MachinesSliceState = {
  data: [],
  isLoading: false
}

const machineSlice = createSlice({
  name: 'machineSlice',
  initialState,
  reducers: {
    getMachineDataFetch: (state) => {
      state.isLoading = true
    },
    getMachineDataSuccess: (state, action: PayloadAction<MachineItem[]>) => {
      state.data = action.payload
      state.isLoading = false
    },
    getMachineDataFailure: (state) => {
      state.isLoading = false
    },
  }
})

export const { getMachineDataFetch , getMachineDataFailure, getMachineDataSuccess  } = machineSlice.actions
export default machineSlice.reducer

