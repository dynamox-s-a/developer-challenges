import type { RootState } from '../../app/store'

export const selectMachinesItems = (state: RootState) => state.machines.items
export const selectMachinesSelected = (state: RootState) =>
  state.machines.selected

export const selectMachinesFetchLoading = (state: RootState) =>
  state.machines.status.fetch.loading
export const selectMachinesFetchError = (state: RootState) =>
  state.machines.status.fetch.error

export const selectMachinesCreateLoading = (state: RootState) =>
  state.machines.status.create.loading
export const selectMachinesCreateError = (state: RootState) =>
  state.machines.status.create.error

export const selectMachinesUpdateLoading = (state: RootState) =>
  state.machines.status.update.loading
export const selectMachinesUpdateError = (state: RootState) =>
  state.machines.status.update.error

export const selectMachinesRemoveLoading = (state: RootState) =>
  state.machines.status.remove.loading
export const selectMachinesRemoveError = (state: RootState) =>
  state.machines.status.remove.error

export const selectMachines = selectMachinesItems
export const selectSelectedMachine = selectMachinesSelected
export const selectMachinesLoading = selectMachinesFetchLoading
export const selectMachinesError = selectMachinesFetchError
