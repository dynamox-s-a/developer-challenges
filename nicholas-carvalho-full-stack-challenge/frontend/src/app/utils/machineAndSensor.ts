import { MachineType, SensorModel } from "../types/enum";

export function canMachineReceiveSensor(machineType: MachineType, sensorModel: SensorModel) {
    if (machineType == MachineType.Pump && (sensorModel == SensorModel.TCAG || sensorModel == SensorModel.TCAS)) {
        return false;
    }
    return true;
}