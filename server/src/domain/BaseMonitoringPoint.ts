import { v4 as uuidv4 } from "uuid";
import { SensorType, MonitoringPoint, MachineType } from "../types/types.js";

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

    /**
     * Validates if a sensor type is compatible with a machine type
     * @param machineType The type of machine (pump or fan)
     * @param sensorType The type of sensor to validate
     * @returns true if compatible, false otherwise
     */
    public static isSensorTypeCompatible(machineType: MachineType, sensorType: SensorType): boolean {
        switch (machineType) {
            case MachineType.PUMP:
                // Pump machines only support HFPlus (pressure) sensors
                // TcAg and TcAs sensors are forbidden for pump machines
                return sensorType === SensorType.HFPlus;
            case MachineType.FAN:
                // Fan machines support TcAg, TcAs, and HFPlus sensors
                return sensorType === SensorType.TcAg || sensorType === SensorType.TcAs || sensorType === SensorType.HFPlus;
            default:
                return false;
        }
    }

    /**
     * Validates sensor type compatibility and throws an error if incompatible
     * @param machineType The type of machine
     * @param sensorType The type of sensor
     * @throws Error if sensor type is not compatible with machine type
     */
    public static validateSensorTypeCompatibility(machineType: MachineType, sensorType: SensorType): void {
        if (!this.isSensorTypeCompatible(machineType, sensorType)) {
            const compatibleSensors = this.getCompatibleSensorTypes(machineType);
            throw new Error(
                `Sensor type '${sensorType}' is not compatible with machine type '${machineType}'. ` +
                `Compatible sensor types are: ${compatibleSensors.join(', ')}`
            );
        }
    }

    /**
     * Gets the list of compatible sensor types for a machine type
     * @param machineType The type of machine
     * @returns Array of compatible sensor types
     */
    public static getCompatibleSensorTypes(machineType: MachineType): SensorType[] {
        switch (machineType) {
            case MachineType.PUMP:
                return [SensorType.HFPlus];
            case MachineType.FAN:
                return [SensorType.TcAg, SensorType.TcAs, SensorType.HFPlus];
            default:
                return [];
        }
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