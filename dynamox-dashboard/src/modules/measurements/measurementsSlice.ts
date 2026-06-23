import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IMeasurementSeries, IMeasurementsState } from './types'

const initialState: IMeasurementsState = {
  data: [],
  error: null,
  isLoading: false,
}

const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    loadMeasurements(state) {
      state.isLoading = true
      state.error = null
    },
    loadMeasurementsSuccess(state, action: PayloadAction<IMeasurementSeries[]>) {
      state.data = action.payload
      state.isLoading = false
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
