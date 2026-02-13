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
  items: [],
  selected: null,
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

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    clearSelectedMachine(state) {
      state.selected = null
    },
    clearMachineErrors(state) {
      state.status.fetch.error = null
      state.status.create.error = null
      state.status.update.error = null
      state.status.remove.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachinesThunk.pending, (state) => {
        state.status.fetch.loading = true
        state.status.fetch.error = null
      })
      .addCase(fetchMachinesThunk.fulfilled, (state, action) => {
        state.status.fetch.loading = false
        state.items = action.payload
        state.status.fetch.error = null
      })
      .addCase(fetchMachinesThunk.rejected, (state, action) => {
        state.status.fetch.loading = false
        state.status.fetch.error =
          (action.payload as string) || 'Erro ao carregar máquinas'
      })
      .addCase(fetchMachineByIdThunk.pending, (state) => {
        state.status.fetch.loading = true
        state.status.fetch.error = null
      })
      .addCase(fetchMachineByIdThunk.fulfilled, (state, action) => {
        state.status.fetch.loading = false
        state.selected = action.payload
        state.status.fetch.error = null
      })
      .addCase(fetchMachineByIdThunk.rejected, (state, action) => {
        state.status.fetch.loading = false
        state.status.fetch.error =
          (action.payload as string) || 'Erro ao carregar máquina'
      })
      .addCase(createMachineThunk.pending, (state) => {
        state.status.create.loading = true
        state.status.create.error = null
      })
      .addCase(createMachineThunk.fulfilled, (state, action) => {
        state.status.create.loading = false
        state.items.push(action.payload)
        state.status.create.error = null
      })
      .addCase(createMachineThunk.rejected, (state, action) => {
        state.status.create.loading = false
        state.status.create.error =
          (action.payload as string) || 'Erro ao criar máquina'
      })
      .addCase(updateMachineThunk.pending, (state) => {
        state.status.update.loading = true
        state.status.update.error = null
      })
      .addCase(updateMachineThunk.fulfilled, (state, action) => {
        state.status.update.loading = false
        const index = state.items.findIndex(
          (m) => m.uuid === action.payload.uuid
        )
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.selected?.uuid === action.payload.uuid) {
          state.selected = action.payload
        }
        state.status.update.error = null
      })
      .addCase(updateMachineThunk.rejected, (state, action) => {
        state.status.update.loading = false
        state.status.update.error =
          (action.payload as string) || 'Erro ao atualizar máquina'
      })
      .addCase(deleteMachineThunk.pending, (state) => {
        state.status.remove.loading = true
        state.status.remove.error = null
      })
      .addCase(deleteMachineThunk.fulfilled, (state, action) => {
        state.status.remove.loading = false
        state.items = state.items.filter((m) => m.uuid !== action.payload)
        if (state.selected?.uuid === action.payload) {
          state.selected = null
        }
        state.status.remove.error = null
      })
      .addCase(deleteMachineThunk.rejected, (state, action) => {
        state.status.remove.loading = false
        state.status.remove.error =
          (action.payload as string) || 'Erro ao deletar máquina'
      })
  }
})

export const { clearSelectedMachine, clearMachineErrors } = machinesSlice.actions
export default machinesSlice.reducer
