import { createSlice } from '@reduxjs/toolkit'
import type { MonitoringState } from './types'
import {
    createMonitoringPoint,
    deleteMonitoringPoint,
    loadMonitoringPoints,
    updateMonitoringPoint,
    setMonitoringSensor
} from './monitoringThunks'

const initialState: MonitoringState = {
    items: [],
    status: 'idle',
    error: null
}

const monitoringSlice = createSlice({
    name: 'monitoring',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadMonitoringPoints.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(loadMonitoringPoints.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items = action.payload
            })
            .addCase(loadMonitoringPoints.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao carregar pontos'
            })

            .addCase(createMonitoringPoint.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(createMonitoringPoint.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items.push(action.payload)
            })
            .addCase(createMonitoringPoint.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao criar ponto'
            })

            .addCase(updateMonitoringPoint.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(updateMonitoringPoint.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items = state.items.map((p) => (p.id === action.payload.id ? action.payload : p))
            })
            .addCase(updateMonitoringPoint.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao atualizar ponto'
            })

            .addCase(deleteMonitoringPoint.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(deleteMonitoringPoint.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items = state.items.filter((p) => p.id !== action.payload)
            })
            .addCase(deleteMonitoringPoint.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao excluir ponto'
            })
            .addCase(setMonitoringSensor.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(setMonitoringSensor.fulfilled, (state, action) => {
                state.status = 'idle'
                state.items = state.items.map((p) => (p.id === action.payload.id ? action.payload : p))
            })
            .addCase(setMonitoringSensor.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Falha ao associar sensor'
            })
    }
})

export default monitoringSlice.reducer
