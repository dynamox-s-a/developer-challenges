import { v4 as uuidv4 } from "uuid";
import { SensorType, MonitoringPoint } from "../types/types.js";

export abstract class BaseMonitoringPoint implements MonitoringPoint {
    protected _userId: string;
    protected _machineId: string;
    protected _name: string;
    protected _sensorType: SensorType;
    protected readonly _sensorId: string;

    protected constructor(userId: string, machineId: string, name: string, sensorType: SensorType, sensorId: string) {
        this._name = name;
        this._sensorType = sensorType;
        this._sensorId = sensorId;
        this._userId = userId;
        this._machineId = machineId;
    }
    get userId(): string {
        return this._userId;
    }
    get machineId(): string {
        return this._machineId;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        if (!name || name.trim() === "") {
            throw new Error("Name cannot be empty");
        }
        this._name = name.trim();
    }

    get sensorType(): SensorType {
        return this._sensorType;
    }

    set sensorType(sensorType: SensorType) {
        this._sensorType = sensorType;
    }

    get sensorId(): string {
        return this._sensorId;
    }

    protected static generateId(): string {
        return uuidv4();
    }

    public toJSON(): MonitoringPoint {
        return {
            userId: this._userId,
            machineId: this._machineId,
            name: this.name,
            sensorType: this.sensorType,
            sensorId: this.sensorId,
        };
    }
} 