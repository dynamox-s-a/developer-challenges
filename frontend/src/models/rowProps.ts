import { MachineData } from '@/models/machineModel';
import { SensorData } from '@/models/sensorModel'
import { MonitorsData } from '@/models/monitorsModel';

export interface RowProps {
    machineData: MachineData;
    sensorData: SensorData;
    monitorsData: MonitorsData;
}