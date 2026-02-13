import { createSlice } from '@reduxjs/toolkit'
import type { MonitoringPointsState } from './monitoringPointsTypes'
import {
  createMonitoringPointThunk,
  deleteMonitoringPointThunk,
  fetchMonitoringPointsThunk,
  updateMonitoringPointThunk
} from './monitoringPointsThunks'

const initialState: MonitoringPointsState = {
  items: [],
  selected: null,
  meta: {
    pagination: {
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 0
    }
  },
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

const monitoringPointsSlice = createSlice({
  name: 'monitoringPoints',
  initialState,
  reducers: {
    clearMonitoringPointsMutationErrors(state) {
      state.status.create.error = null
      state.status.update.error = null
      state.status.remove.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringPointsThunk.pending, (state) => {
        state.status.fetch.loading = true
        state.status.fetch.error = null
      })
      .addCase(fetchMonitoringPointsThunk.fulfilled, (state, action) => {
        state.status.fetch.loading = false
        state.items = action.payload.data
        state.meta.pagination = action.payload.pagination
      })
      .addCase(fetchMonitoringPointsThunk.rejected, (state, action) => {
        state.status.fetch.loading = false
        state.status.fetch.error =
          (action.payload as string) ||
          'Erro ao carregar pontos de monitoramento'
      })
      .addCase(createMonitoringPointThunk.pending, (state) => {
        state.status.create.loading = true
        state.status.create.error = null
      })
      .addCase(createMonitoringPointThunk.fulfilled, (state) => {
        state.status.create.loading = false
      })
      .addCase(createMonitoringPointThunk.rejected, (state, action) => {
        state.status.create.loading = false
        state.status.create.error =
          (action.payload as string) || 'Erro ao criar ponto de monitoramento'
      })
      .addCase(updateMonitoringPointThunk.pending, (state) => {
        state.status.update.loading = true
        state.status.update.error = null
      })
      .addCase(updateMonitoringPointThunk.fulfilled, (state) => {
        state.status.update.loading = false
      })
      .addCase(updateMonitoringPointThunk.rejected, (state, action) => {
        state.status.update.loading = false
        state.status.update.error =
          (action.payload as string) ||
          'Erro ao atualizar ponto de monitoramento'
      })
      .addCase(deleteMonitoringPointThunk.pending, (state) => {
        state.status.remove.loading = true
        state.status.remove.error = null
      })
      .addCase(deleteMonitoringPointThunk.fulfilled, (state) => {
        state.status.remove.loading = false
      })
      .addCase(deleteMonitoringPointThunk.rejected, (state, action) => {
        state.status.remove.loading = false
        state.status.remove.error =
          (action.payload as string) || 'Erro ao deletar ponto de monitoramento'
      })
  }
})

export const { clearMonitoringPointsMutationErrors } =
  monitoringPointsSlice.actions
export default monitoringPointsSlice.reducer
