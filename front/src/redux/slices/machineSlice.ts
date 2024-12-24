import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MachineReduxState } from '../interface'

const initialState: MachineReduxState = {
  id: undefined,
  name: undefined,
  type: undefined
}

const machineSlice = createSlice({
  name: 'machine',
  initialState,
  reducers: {
    setMachine: (state, action: PayloadAction<MachineReduxState>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.type = action.payload.type
    },
    clearMachine: (state) => {
      state.id = undefined
      state.name = undefined
      state.type = undefined
    }
  }
})

export const { setMachine, clearMachine } = machineSlice.actions

export default machineSlice.reducer
