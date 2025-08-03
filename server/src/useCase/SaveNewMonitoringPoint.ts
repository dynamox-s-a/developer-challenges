import { PumpMonitoringPoint } from "../domain/PumpMonitoringPoint.js";
import { FanMonitoringPoint } from "../domain/FanMonitoringPoint.js";
import { BaseMonitoringPoint } from "../domain/BaseMonitoringPoint.js";
import { MachineRepositoryMemory } from "../repository/MachineRepositoryMemory.js";
import { MonitoringPointRepositoryMemory } from "../repository/MonitoringPointRepositoryMemory.js";
import { MachineType, MonitoringPoint, SensorType } from "../types/types.js";

export default class SaveNewMonitoringPoint {
    private machineRepository: MachineRepositoryMemory;
    private monitoringPointRepository: MonitoringPointRepositoryMemory;

    constructor(machineRepository: MachineRepositoryMemory, monitoringPointRepository: MonitoringPointRepositoryMemory) {
        this.machineRepository = machineRepository;
        this.monitoringPointRepository = monitoringPointRepository;
    }

    async execute(userId: string, machineId: string, name: string, sensorType: SensorType): Promise<string> {
        const machine = await this.machineRepository.getById(machineId);
        if (!machine) throw new Error("Machine not found");
        BaseMonitoringPoint.validateSensorTypeCompatibility(machine.type, sensorType);
        let monitoringPoint: MonitoringPoint;
        switch (sensorType) {
            case SensorType.TcAg:
            case SensorType.TcAs:
                monitoringPoint = FanMonitoringPoint.create(userId, machineId, name, sensorType);
                break;
            case SensorType.HFPlus:
                monitoringPoint = PumpMonitoringPoint.create(userId, machineId, name, sensorType);
                break;
            default:
                throw new Error("Invalid sensor type");
        }
        return await this.monitoringPointRepository.save(monitoringPoint);
    }
}