import { MachineType, SensorModel } from "./enum";

export type MonitoringPointType = {
    id: string,
    name: string,
    machineId: string,
    createdAt: Date | null,
    machine: { name: string, type: MachineType },
    sensor?: { id: string, model: SensorModel, sensorUid: string }
}

export type CreateMonitoringPoint = {
    name: string,
    machineId: string
}

export type UpdateMonitoringPoint = {
    name?: string,
    machineId?: string
}

export type InitialMonitoringState = {
    items: MonitoringPointType[],
    total: number,
    isLoading: boolean,
};