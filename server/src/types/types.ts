export const MachineType = {
    PUMP: "pump",
    FAN: "fan",
} as const;

export type MachineType = (typeof MachineType)[keyof typeof MachineType];

export const SensorType = {
    TcAg: "temperature",
    TcAs: "humidity",
    HFPlus: "pressure",
} as const;

export type SensorType = (typeof SensorType)[keyof typeof SensorType];

export type PumpMonitoringSensorType = typeof SensorType.HFPlus;
export type FanMonitoringSensorType = typeof SensorType.TcAg | typeof SensorType.TcAs;

export interface MachineBase {
    userId: string;
    id: string;
    name: string;
    type: MachineType;
}

export interface MonitoringPoint {
    name: string;
    sensorType: SensorType;
    sensorId: string;
}

export interface MachineDTO {
    userId: string;
    id: string;
    name: string;
    type: MachineType;
    monitoringPoints: MonitoringPoint[];
}