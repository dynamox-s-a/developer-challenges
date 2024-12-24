import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PointReduxState } from '../interface'

const initialState: PointReduxState = {
  id: undefined,
  name: undefined,
  linkedMachine: undefined
}

const pointSlice = createSlice({
  name: 'point',
  initialState,
  reducers: {
    setPoint: (state, action: PayloadAction<PointReduxState>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.linkedMachine = action.payload.linkedMachine
    },
    clearPoint: (state) => {
      state.id = undefined
      state.name = undefined
      state.linkedMachine = undefined
    }
  }
})

export const { setPoint, clearPoint } = pointSlice.actions

export default pointSlice.reducer
