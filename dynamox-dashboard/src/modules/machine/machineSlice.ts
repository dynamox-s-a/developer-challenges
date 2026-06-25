import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IMachineInfo, IMachineState } from './types'

const initialState: IMachineState = {
  data: null,
  error: null,
  isLoading: false,
}

const machineSlice = createSlice({
  name: 'machine',
  initialState,
  reducers: {
    loadMachine(state) {
      state.error = null
      state.isLoading = true
    },
    loadMachineSuccess(state, action: PayloadAction<IMachineInfo>) {
      state.data = action.payload
      state.isLoading = false
    },
    loadMachineFailure(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { loadMachine, loadMachineFailure, loadMachineSuccess } =
  machineSlice.actions

export const machineReducer = machineSlice.reducer
