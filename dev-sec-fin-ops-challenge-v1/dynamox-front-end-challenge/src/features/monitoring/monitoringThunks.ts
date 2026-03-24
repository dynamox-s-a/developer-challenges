import { createAsyncThunk } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

import type { RootState } from '../../app/store'
import { api } from '../../services/api'

import type { MonitoringPoint, Sensor } from './types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const loadMonitoringPoints = createAsyncThunk<MonitoringPoint[]>(
    'monitoring/load',
    async () => {
        await delay(200)
        return api.get<MonitoringPoint[]>('/monitoringPoints')
    }
)

export const createMonitoringPoint = createAsyncThunk<
    MonitoringPoint,
    { machineId: string; name: string },
    { state: RootState }
>('monitoring/create', async ({ machineId, name }, { getState }) => {
    await delay(200)

    const trimmed = name.trim()
    if (!trimmed) throw new Error('Nome é obrigatório')
    if (!machineId) throw new Error('Máquina é obrigatória')

    const machineExists = getState().machines.items.some((m) => m.id === machineId)
    if (!machineExists) throw new Error('Máquina não encontrada')

    const newPoint: MonitoringPoint = {
        id: uuid(),
        machineId,
        name: trimmed,
        sensor: null
    }

    return api.post<MonitoringPoint>('/monitoringPoints', newPoint)
})

export const updateMonitoringPoint = createAsyncThunk<
    MonitoringPoint,
    { id: string; machineId: string; name: string },
    { state: RootState }
>('monitoring/update', async ({ id, machineId, name }, { getState }) => {
    await delay(200)

    const trimmed = name.trim()
    if (!trimmed) throw new Error('Nome é obrigatório')
    if (!machineId) throw new Error('Máquina é obrigatória')

    const current = getState().monitoring.items
    const exists = current.some((p) => p.id === id)
    if (!exists) throw new Error('Ponto não encontrado')

    const prev = current.find((p) => p.id === id)!
    const updated: MonitoringPoint = {
        ...prev,
        id,
        machineId,
        name: trimmed
    }

    return api.put<MonitoringPoint>(`/monitoringPoints/${id}`, updated)
})

export const deleteMonitoringPoint = createAsyncThunk<
    string,
    { id: string }
>('monitoring/delete', async ({ id }) => {
    await delay(150)
    await api.del(`/monitoringPoints/${id}`)
    return id
})

export const setMonitoringSensor = createAsyncThunk<
    MonitoringPoint,
    { monitoringPointId: string; sensor: Sensor | null },
    { state: RootState }
>('monitoring/setSensor', async ({ monitoringPointId, sensor }, { getState }) => {
    await delay(200)

    const state = getState()
    const points = state.monitoring.items
    const point = points.find((p) => p.id === monitoringPointId)
    if (!point) throw new Error('Ponto não encontrado')

    if (!sensor) {
        const updated: MonitoringPoint = { ...point, sensor: null }
        return api.put<MonitoringPoint>(`/monitoringPoints/${monitoringPointId}`, updated)
    }

    const sensorId = sensor.id.trim()
    if (!sensorId) throw new Error('ID do sensor é obrigatório')

    const duplicated = points.some(
        (p) => p.id !== monitoringPointId && p.sensor?.id === sensorId
    )
    if (duplicated) throw new Error('ID do sensor já está em uso')

    const machine = state.machines.items.find((m) => m.id === point.machineId)
    const machineType = machine?.type

    if (machineType === 'Pump' && (sensor.model === 'TcAg' || sensor.model === 'TcAs')) {
        throw new Error('Sensores TcAg/TcAs não podem ser usados em máquinas do tipo Pump')
    }

    const updated: MonitoringPoint = {
        ...point,
        sensor: { id: sensorId, model: sensor.model }
    }

    return api.put<MonitoringPoint>(`/monitoringPoints/${monitoringPointId}`, updated)
})
