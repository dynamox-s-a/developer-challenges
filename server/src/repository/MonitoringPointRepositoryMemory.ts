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

    async delete(id: string): Promise<void> {
        this.monitoringPoints = this.monitoringPoints.filter(monitoringPoint => monitoringPoint.machineId !== id);
    }

    // for testing purposes ONLY
    async clear(): Promise<void> {
        this.monitoringPoints = [];
    }
}