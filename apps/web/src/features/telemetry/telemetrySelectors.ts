import type { RootState } from '../../app/store'

export const selectTelemetryItems = (state: RootState) => state.telemetry.items
export const selectTelemetrySelected = (state: RootState) =>
  state.telemetry.selected

export const selectTelemetryMeta = (state: RootState) => state.telemetry.meta
export const selectTelemetrySeries = (state: RootState) =>
  state.telemetry.meta.series
export const selectTelemetryCount = (state: RootState) => state.telemetry.meta.count
export const selectTelemetryMetrics = (state: RootState) =>
  state.telemetry.meta.metrics
export const selectTelemetryCreated = (state: RootState) =>
  state.telemetry.meta.created
export const selectTelemetryDeleted = (state: RootState) =>
  state.telemetry.meta.deleted
export const selectTelemetryDeletedBatch = (state: RootState) =>
  state.telemetry.meta.deletedBatch

export const selectTelemetryFetchLoading = (state: RootState) =>
  state.telemetry.status.fetch.loading
export const selectTelemetryFetchError = (state: RootState) =>
  state.telemetry.status.fetch.error

export const selectTelemetryCreateLoading = (state: RootState) =>
  state.telemetry.status.create.loading
export const selectTelemetryCreateError = (state: RootState) =>
  state.telemetry.status.create.error

export const selectTelemetryUpdateLoading = (state: RootState) =>
  state.telemetry.status.update.loading
export const selectTelemetryUpdateError = (state: RootState) =>
  state.telemetry.status.update.error

export const selectTelemetryRemoveLoading = (state: RootState) =>
  state.telemetry.status.remove.loading
export const selectTelemetryRemoveError = (state: RootState) =>
  state.telemetry.status.remove.error
