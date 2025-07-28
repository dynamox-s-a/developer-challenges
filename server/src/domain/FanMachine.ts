import { MachineType } from "./types.js";
import { BaseMachine } from "./BaseMachine.js";
import { FanMonitoringPoint } from "./FanMonitoringPoint.js";

export class FanMachine extends BaseMachine {
    private monitoringPoints: FanMonitoringPoint[] = [];

    private constructor(id: string, name: string, type: MachineType) {
        super(id, name, type);
    }

    static create(name: string, type: MachineType): FanMachine {
        return new FanMachine(this.generateId(), name, type);
    }

    addMonitoringPoint(point: FanMonitoringPoint): void {
        this.monitoringPoints.push(point);
    }

    removeMonitoringPoint(sensorId: string): boolean {
        const initialLength = this.monitoringPoints.length;
        this.monitoringPoints = this.monitoringPoints.filter(
            point => point.sensorId !== sensorId
        );
        return this.monitoringPoints.length < initialLength;
    }

    getMonitoringPoints(): FanMonitoringPoint[] {
        return [...this.monitoringPoints];
    }

    getMonitoringPoint(sensorId: string): FanMonitoringPoint | undefined {
        return this.monitoringPoints.find(point => point.sensorId === sensorId);
    }

    public override toJSON() {
        return {
            ...super.toJSON(),
            monitoringPoints: this.monitoringPoints.map(point => point.toJSON()),
        };
    }
} 