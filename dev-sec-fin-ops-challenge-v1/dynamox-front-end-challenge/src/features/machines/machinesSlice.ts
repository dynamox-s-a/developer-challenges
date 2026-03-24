import { createSlice } from '@reduxjs/toolkit'
import type { MachinesState } from './types'
import { createMachine, deleteMachine, loadMachines, updateMachine } from './machinesThunks'

const initialState: MachinesState = {
    items: [],
    status: 'idle',
    error: null
}

const machinesSlice = createSlice({
    name: 'machines',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadMachines.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(loadMachines.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items = action.payload
            })
            .addCase(loadMachines.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao carregar máquinas'
            })

            .addCase(createMachine.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(createMachine.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items.push(action.payload)
            })
            .addCase(createMachine.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao criar máquina'
            })

            .addCase(updateMachine.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(updateMachine.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items = state.items.map((m) => (m.id === action.payload.id ? action.payload : m))
            })
            .addCase(updateMachine.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao atualizar máquina'
            })

            .addCase(deleteMachine.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(deleteMachine.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items = state.items.filter((m) => m.id !== action.payload)
            })
            .addCase(deleteMachine.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao excluir máquina'
            })
    }
})

export default machinesSlice.reducer
