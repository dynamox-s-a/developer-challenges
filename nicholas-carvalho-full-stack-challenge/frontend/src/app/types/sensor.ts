import { SensorModel } from "./enum"

export type SensorState = {
    id: string,
    sensorUid: string,
    model: string,
    monitoringPointId: string | null,
    createdAt: Date
}

export type UpdateSensorForm = {
    monitoringPointId: string,
    name?: string,
    machineId?: string,
    sensor?: { id: string, sensorUid?: string, model?: SensorModel | string } | null
}

export type InitialSensorState = {
    sensorItems: SensorState[],
    sensorIsLoading: boolean,
    selectedSensorId: string
}