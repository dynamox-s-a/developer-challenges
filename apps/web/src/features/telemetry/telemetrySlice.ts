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
    points: {
      loading: false,
      error: null
    },
    metrics: {
      loading: false,
      error: null
    },
    count: {
      loading: false,
      error: null
    },
    create: {
      loading: false,
      error: null
    },
    delete: {
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
      state.status.points.error = null
      state.status.metrics.error = null
      state.status.count.error = null
      state.status.create.error = null
      state.status.delete.error = null
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
        state.status.points.loading = true
        state.status.points.error = null
      })
      .addCase(fetchTelemetrySeriesThunk.fulfilled, (state, action) => {
        state.status.points.loading = false
        state.meta.series = action.payload
        state.items = action.payload.points
        state.selected = { sensorUuid: action.payload.sensor.uuid }
      })
      .addCase(fetchTelemetrySeriesThunk.rejected, (state, action) => {
        state.status.points.loading = false
        state.status.points.error =
          (action.payload as string) || 'Erro ao carregar série temporal'
      })
      .addCase(fetchTelemetryCountThunk.pending, (state) => {
        state.status.count.loading = true
        state.status.count.error = null
      })
      .addCase(fetchTelemetryCountThunk.fulfilled, (state, action) => {
        state.status.count.loading = false
        state.meta.count = action.payload
      })
      .addCase(fetchTelemetryCountThunk.rejected, (state, action) => {
        state.status.count.loading = false
        state.status.count.error =
          (action.payload as string) || 'Erro ao carregar contagem de telemetria'
      })
      .addCase(fetchTelemetryMetricsThunk.pending, (state) => {
        state.status.metrics.loading = true
        state.status.metrics.error = null
      })
      .addCase(fetchTelemetryMetricsThunk.fulfilled, (state, action) => {
        state.status.metrics.loading = false
        state.meta.metrics = action.payload
      })
      .addCase(fetchTelemetryMetricsThunk.rejected, (state, action) => {
        state.status.metrics.loading = false
        state.status.metrics.error =
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
        state.status.delete.loading = true
        state.status.delete.error = null
      })
      .addCase(deleteTelemetrySeriesThunk.fulfilled, (state, action) => {
        state.status.delete.loading = false
        state.meta.deleted = action.payload
      })
      .addCase(deleteTelemetrySeriesThunk.rejected, (state, action) => {
        state.status.delete.loading = false
        state.status.delete.error =
          (action.payload as string) || 'Erro ao deletar série temporal'
      })
      .addCase(deleteTelemetryBatchThunk.pending, (state) => {
        state.status.delete.loading = true
        state.status.delete.error = null
      })
      .addCase(deleteTelemetryBatchThunk.fulfilled, (state, action) => {
        state.status.delete.loading = false
        state.meta.deletedBatch = action.payload
      })
      .addCase(deleteTelemetryBatchThunk.rejected, (state, action) => {
        state.status.delete.loading = false
        state.status.delete.error =
          (action.payload as string) || 'Erro ao deletar lote de telemetria'
      })
  }
})

export const { clearTelemetryErrors, clearTelemetryData } = telemetrySlice.actions
export default telemetrySlice.reducer
