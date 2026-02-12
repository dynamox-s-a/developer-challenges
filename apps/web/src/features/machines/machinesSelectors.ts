import type { RootState } from '../../app/store'

export const selectMachines = (state: RootState) => state.machines.machines
export const selectSelectedMachine = (state: RootState) =>
  state.machines.selectedMachine
export const selectMachinesLoading = (state: RootState) =>
  state.machines.loading
export const selectMachinesError = (state: RootState) => state.machines.error
