import { createSlice } from '@reduxjs/toolkit'
import {
  createSensorThunk,
  deleteSensorThunk,
  updateSensorThunk
} from './sensorsThunks'
import type { SensorsState } from './sensorsTypes'

const initialState: SensorsState = {
  items: [],
  selected: null,
  status: {
    fetch: {
      loading: false,
      error: null
    },
    create: {
      loading: false,
      error: null
    },
    update: {
      loading: false,
      error: null
    },
    remove: {
      loading: false,
      error: null
    }
  }
}

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    clearSensorsMutationErrors(state) {
      state.status.create.error = null
      state.status.update.error = null
      state.status.remove.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSensorThunk.pending, (state) => {
        state.status.create.loading = true
        state.status.create.error = null
      })
      .addCase(createSensorThunk.fulfilled, (state) => {
        state.status.create.loading = false
      })
      .addCase(createSensorThunk.rejected, (state, action) => {
        state.status.create.loading = false
        state.status.create.error =
          (action.payload as string) || 'Erro ao criar sensor'
      })
      .addCase(updateSensorThunk.pending, (state) => {
        state.status.update.loading = true
        state.status.update.error = null
      })
      .addCase(updateSensorThunk.fulfilled, (state) => {
        state.status.update.loading = false
      })
      .addCase(updateSensorThunk.rejected, (state, action) => {
        state.status.update.loading = false
        state.status.update.error =
          (action.payload as string) || 'Erro ao atualizar sensor'
      })
      .addCase(deleteSensorThunk.pending, (state) => {
        state.status.remove.loading = true
        state.status.remove.error = null
      })
      .addCase(deleteSensorThunk.fulfilled, (state) => {
        state.status.remove.loading = false
      })
      .addCase(deleteSensorThunk.rejected, (state, action) => {
        state.status.remove.loading = false
        state.status.remove.error =
          (action.payload as string) || 'Erro ao deletar sensor'
      })
  }
})

export const { clearSensorsMutationErrors } = sensorsSlice.actions
export default sensorsSlice.reducer
