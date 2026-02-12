import { createSlice } from '@reduxjs/toolkit'
import type { MachinesState } from './machinesTypes'
import {
  createMachineThunk,
  deleteMachineThunk,
  fetchMachineByIdThunk,
  fetchMachinesThunk,
  updateMachineThunk
} from './machinesThunks'

const initialState: MachinesState = {
  machines: [],
  selectedMachine: null,
  loading: false,
  error: null
}

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    clearSelectedMachine(state) {
      state.selectedMachine = null
    },
    clearError(state) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachinesThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMachinesThunk.fulfilled, (state, action) => {
        state.loading = false
        state.machines = action.payload
        state.error = null
      })
      .addCase(fetchMachinesThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Erro ao carregar máquinas'
      })
      .addCase(fetchMachineByIdThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMachineByIdThunk.fulfilled, (state, action) => {
        state.loading = false
        state.selectedMachine = action.payload
        state.error = null
      })
      .addCase(fetchMachineByIdThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Erro ao carregar máquina'
      })
      .addCase(createMachineThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMachineThunk.fulfilled, (state, action) => {
        state.loading = false
        state.machines.push(action.payload)
        state.error = null
      })
      .addCase(createMachineThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Erro ao criar máquina'
      })
      .addCase(updateMachineThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMachineThunk.fulfilled, (state, action) => {
        state.loading = false
        const index = state.machines.findIndex(
          (m) => m.uuid === action.payload.uuid
        )
        if (index !== -1) {
          state.machines[index] = action.payload
        }
        if (state.selectedMachine?.uuid === action.payload.uuid) {
          state.selectedMachine = action.payload
        }
        state.error = null
      })
      .addCase(updateMachineThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Erro ao atualizar máquina'
      })
      .addCase(deleteMachineThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMachineThunk.fulfilled, (state, action) => {
        state.loading = false
        state.machines = state.machines.filter((m) => m.uuid !== action.payload)
        if (state.selectedMachine?.uuid === action.payload) {
          state.selectedMachine = null
        }
        state.error = null
      })
      .addCase(deleteMachineThunk.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Erro ao deletar máquina'
      })
  }
})

export const { clearSelectedMachine, clearError } = machinesSlice.actions
export default machinesSlice.reducer
