import { createReducer } from '@reduxjs/toolkit'
import { DataState } from './types'
import { dataFetchFailed, dataFetchRequested, dataFetchSucceeded } from './actions'

const initial: DataState = {
  loading: false,
  error: null,
  acceleration: [],
  velocity: [],
  temperature: [],
}

const reducer = createReducer(initial, builder => {
  builder
    .addCase(dataFetchRequested, state => { state.loading = true; state.error = null })
    .addCase(dataFetchSucceeded, (state, { payload }) => {
      state.loading = false
      state.acceleration = payload.acceleration
      state.velocity = payload.velocity
      state.temperature = payload.temperature
    })
    .addCase(dataFetchFailed, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })
})

export default reducer
