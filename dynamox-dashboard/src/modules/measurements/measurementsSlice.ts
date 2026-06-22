import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IMeasurementsPayload, IMeasurementsState } from './types'

const initialState: IMeasurementsState = {
  data: [],
  error: null,
  isLoading: false,
  machine: null,
}

const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    loadMeasurements(state) {
      state.isLoading = true
      state.error = null
    },
    loadMeasurementsSuccess(state, action: PayloadAction<IMeasurementsPayload>) {
      state.data = action.payload.measurements
      state.isLoading = false
      state.machine = action.payload.machine
    },
    loadMeasurementsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const {
  loadMeasurements,
  loadMeasurementsFailure,
  loadMeasurementsSuccess,
} = measurementsSlice.actions

export const measurementsReducer = measurementsSlice.reducer
