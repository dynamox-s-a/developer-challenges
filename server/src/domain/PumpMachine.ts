import { MachineType } from "./types.js";
import { BaseMachine } from "./BaseMachine.js";
import { PumpMonitoringPoint } from "./PumpMonitoringPoint.js";

export class PumpMachine extends BaseMachine {
    private monitoringPoints: PumpMonitoringPoint[] = [];

    private constructor(userId: string, id: string, name: string, type: MachineType) {
        super(userId, id, name, type);
    }

    static create(userId: string, name: string, type: MachineType): PumpMachine {
        return new PumpMachine(userId, this.generateId(), name, type);
    }

    addMonitoringPoint(point: PumpMonitoringPoint): void {
        this.monitoringPoints.push(point);
    }

    removeMonitoringPoint(sensorId: string): boolean {
        const initialLength = this.monitoringPoints.length;
        this.monitoringPoints = this.monitoringPoints.filter(
            point => point.sensorId !== sensorId
        );
        return this.monitoringPoints.length < initialLength;
    }

    getMonitoringPoints(): PumpMonitoringPoint[] {
        return [...this.monitoringPoints];
    }

    getMonitoringPoint(sensorId: string): PumpMonitoringPoint | undefined {
        return this.monitoringPoints.find(point => point.sensorId === sensorId);
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
            monitoringPoints: this.monitoringPoints.map(point => point.toJSON()),
        };
    }
} 