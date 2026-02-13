import { createSlice } from '@reduxjs/toolkit'
import {
  createTelemetrySeriesThunk,
  deleteTelemetryBatchThunk,
  deleteTelemetrySeriesThunk,
  fetchTelemetryCountThunk,
  fetchTelemetryMetricsThunk,
  fetchTelemetrySeriesThunk
} from './telemetryThunks'
import type { TelemetryState } from './telemetryTypes'

const initialState: TelemetryState = {
  items: [],
  selected: null,
  meta: {
    series: null,
    count: null,
    metrics: null,
    created: null,
    deleted: null,
    deletedBatch: null
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

const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {
    clearTelemetryErrors(state) {
      state.status.fetch.error = null
      state.status.create.error = null
      state.status.update.error = null
      state.status.remove.error = null
    },
    clearTelemetryData(state) {
      state.items = []
      state.selected = null
      state.meta.series = null
      state.meta.count = null
      state.meta.metrics = null
      state.meta.created = null
      state.meta.deleted = null
      state.meta.deletedBatch = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTelemetrySeriesThunk.pending, (state) => {
        state.status.fetch.loading = true
        state.status.fetch.error = null
      })
      .addCase(fetchTelemetrySeriesThunk.fulfilled, (state, action) => {
        state.status.fetch.loading = false
        state.meta.series = action.payload
        state.items = action.payload.points
        state.selected = { sensorUuid: action.payload.sensor.uuid }
      })
      .addCase(fetchTelemetrySeriesThunk.rejected, (state, action) => {
        state.status.fetch.loading = false
        state.status.fetch.error =
          (action.payload as string) || 'Erro ao carregar série temporal'
      })
      .addCase(fetchTelemetryCountThunk.pending, (state) => {
        state.status.fetch.loading = true
        state.status.fetch.error = null
      })
      .addCase(fetchTelemetryCountThunk.fulfilled, (state, action) => {
        state.status.fetch.loading = false
        state.meta.count = action.payload
      })
      .addCase(fetchTelemetryCountThunk.rejected, (state, action) => {
        state.status.fetch.loading = false
        state.status.fetch.error =
          (action.payload as string) || 'Erro ao carregar contagem de telemetria'
      })
      .addCase(fetchTelemetryMetricsThunk.pending, (state) => {
        state.status.fetch.loading = true
        state.status.fetch.error = null
      })
      .addCase(fetchTelemetryMetricsThunk.fulfilled, (state, action) => {
        state.status.fetch.loading = false
        state.meta.metrics = action.payload
      })
      .addCase(fetchTelemetryMetricsThunk.rejected, (state, action) => {
        state.status.fetch.loading = false
        state.status.fetch.error =
          (action.payload as string) || 'Erro ao carregar métricas de telemetria'
      })
      .addCase(createTelemetrySeriesThunk.pending, (state) => {
        state.status.create.loading = true
        state.status.create.error = null
      })
      .addCase(createTelemetrySeriesThunk.fulfilled, (state, action) => {
        state.status.create.loading = false
        state.meta.created = action.payload
      })
      .addCase(createTelemetrySeriesThunk.rejected, (state, action) => {
        state.status.create.loading = false
        state.status.create.error =
          (action.payload as string) || 'Erro ao criar série temporal'
      })
      .addCase(deleteTelemetrySeriesThunk.pending, (state) => {
        state.status.remove.loading = true
        state.status.remove.error = null
      })
      .addCase(deleteTelemetrySeriesThunk.fulfilled, (state, action) => {
        state.status.remove.loading = false
        state.meta.deleted = action.payload
      })
      .addCase(deleteTelemetrySeriesThunk.rejected, (state, action) => {
        state.status.remove.loading = false
        state.status.remove.error =
          (action.payload as string) || 'Erro ao deletar série temporal'
      })
      .addCase(deleteTelemetryBatchThunk.pending, (state) => {
        state.status.remove.loading = true
        state.status.remove.error = null
      })
      .addCase(deleteTelemetryBatchThunk.fulfilled, (state, action) => {
        state.status.remove.loading = false
        state.meta.deletedBatch = action.payload
      })
      .addCase(deleteTelemetryBatchThunk.rejected, (state, action) => {
        state.status.remove.loading = false
        state.status.remove.error =
          (action.payload as string) || 'Erro ao deletar lote de telemetria'
      })
  }
})

export const { clearTelemetryErrors, clearTelemetryData } = telemetrySlice.actions
export default telemetrySlice.reducer
