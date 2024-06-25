import { MachineData } from '@/models/machineModel';
import { SensorData } from '@/models/sensorModel'

export interface RowProps {
    machineData: MachineData;
    sensorData: SensorData[];
}