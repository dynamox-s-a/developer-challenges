import type { RootState } from '../../app/store'

export const selectMonitoringPointsItems = (state: RootState) =>
  state.monitoringPoints.items

export const selectMonitoringPointsSelected = (state: RootState) =>
  state.monitoringPoints.selected

export const selectMonitoringPointsMeta = (state: RootState) =>
  state.monitoringPoints.meta

export const selectMonitoringPointsPagination = (state: RootState) =>
  state.monitoringPoints.meta.pagination

export const selectMonitoringPointsFetchLoading = (state: RootState) =>
  state.monitoringPoints.status.fetch.loading

export const selectMonitoringPointsFetchError = (state: RootState) =>
  state.monitoringPoints.status.fetch.error

export const selectMonitoringPointsCreateLoading = (state: RootState) =>
  state.monitoringPoints.status.create.loading

export const selectMonitoringPointsCreateError = (state: RootState) =>
  state.monitoringPoints.status.create.error

export const selectMonitoringPointsUpdateLoading = (state: RootState) =>
  state.monitoringPoints.status.update.loading

export const selectMonitoringPointsUpdateError = (state: RootState) =>
  state.monitoringPoints.status.update.error

export const selectMonitoringPointsRemoveLoading = (state: RootState) =>
  state.monitoringPoints.status.remove.loading

export const selectMonitoringPointsRemoveError = (state: RootState) =>
  state.monitoringPoints.status.remove.error

// Backward-compatible aliases while the app converges on a single naming style.
export const selectMonitoringPoints = selectMonitoringPointsItems
export const selectMonitoringPointsListLoading =
  selectMonitoringPointsFetchLoading
export const selectMonitoringPointsListError = selectMonitoringPointsFetchError
export const selectMonitoringPointCreating = selectMonitoringPointsCreateLoading
export const selectMonitoringPointCreateError = selectMonitoringPointsCreateError
export const selectMonitoringPointUpdating = selectMonitoringPointsUpdateLoading
export const selectMonitoringPointUpdateError = selectMonitoringPointsUpdateError
export const selectMonitoringPointDeleting = selectMonitoringPointsRemoveLoading
export const selectMonitoringPointDeleteError = selectMonitoringPointsRemoveError
