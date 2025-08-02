import { MonitoringPointDTO } from "../types/types.js";

export class MonitoringPointRepositoryMemory {
    private monitoringPoints: MonitoringPointDTO[] = [];

    async save(monitoringPoint: MonitoringPointDTO): Promise<string> {
        this.monitoringPoints.push(monitoringPoint);
        return monitoringPoint.sensorId;
    }

    async getByMachineId(machineId: string): Promise<MonitoringPointDTO[]> {
        return this.monitoringPoints.filter(monitoringPoint => monitoringPoint.machineId === machineId);
    }

    async getByUserId(userId: string): Promise<MonitoringPointDTO[]> {
        return this.monitoringPoints.filter(monitoringPoint => monitoringPoint.userId === userId);
    }

    // deletes all monitoring points related to a machineId
    async deleteByMachineId(machineId: string): Promise<void> {
        this.monitoringPoints = this.monitoringPoints.filter(monitoringPoint => monitoringPoint.machineId !== machineId);
    }

    // deletes a single monitoring point related to a sensorId
    async deleteBySensorId(sensorId: string): Promise<void> {
        this.monitoringPoints = this.monitoringPoints.filter(monitoringPoint => monitoringPoint.sensorId !== sensorId);
    }

    // for testing purposes ONLY
    async clear(): Promise<void> {
        this.monitoringPoints = [];
    }
}