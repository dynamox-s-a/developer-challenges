import type { RootState } from '../../app/store'

export const selectSensorsItems = (state: RootState) => state.sensors.items

export const selectSensorsSelected = (state: RootState) => state.sensors.selected

export const selectSensorsFetchLoading = (state: RootState) =>
  state.sensors.status.fetch.loading

export const selectSensorsFetchError = (state: RootState) =>
  state.sensors.status.fetch.error

export const selectSensorsCreateLoading = (state: RootState) =>
  state.sensors.status.create.loading

export const selectSensorsCreateError = (state: RootState) =>
  state.sensors.status.create.error

export const selectSensorsUpdateLoading = (state: RootState) =>
  state.sensors.status.update.loading

export const selectSensorsUpdateError = (state: RootState) =>
  state.sensors.status.update.error

export const selectSensorsRemoveLoading = (state: RootState) =>
  state.sensors.status.remove.loading

export const selectSensorsRemoveError = (state: RootState) =>
  state.sensors.status.remove.error

// Backward-compatible aliases while the app converges on a single naming style.
export const selectSensorCreating = selectSensorsCreateLoading
export const selectSensorCreateError = selectSensorsCreateError
export const selectSensorUpdating = selectSensorsUpdateLoading
export const selectSensorUpdateError = selectSensorsUpdateError
export const selectSensorDeleting = selectSensorsRemoveLoading
export const selectSensorDeleteError = selectSensorsRemoveError
