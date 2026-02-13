import type { RootState } from '../../app/store'

export const selectTelemetryItems = (state: RootState) => state.telemetry.items
export const selectTelemetryPoints = selectTelemetryItems
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

export const selectTelemetryPointsLoading = (state: RootState) =>
  state.telemetry.status.points.loading
export const selectTelemetryPointsError = (state: RootState) =>
  state.telemetry.status.points.error

export const selectTelemetryMetricsLoading = (state: RootState) =>
  state.telemetry.status.metrics.loading
export const selectTelemetryMetricsError = (state: RootState) =>
  state.telemetry.status.metrics.error

export const selectTelemetryCountLoading = (state: RootState) =>
  state.telemetry.status.count.loading
export const selectTelemetryCountError = (state: RootState) =>
  state.telemetry.status.count.error

export const selectTelemetryCreateLoading = (state: RootState) =>
  state.telemetry.status.create.loading
export const selectTelemetryCreateError = (state: RootState) =>
  state.telemetry.status.create.error

export const selectTelemetryDeleteLoading = (state: RootState) =>
  state.telemetry.status.delete.loading
export const selectTelemetryDeleteError = (state: RootState) =>
  state.telemetry.status.delete.error
