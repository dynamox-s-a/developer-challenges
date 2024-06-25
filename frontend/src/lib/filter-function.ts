import { MachineData } from '../models/machineModel';

export interface MachineDataArray extends Array<MachineData> {
    map: any;
    machine_id: number;
    user_id: number;
    machine_type: string;
    machine_name: string;
    createdAt: string;
    updatedAt: string;
    sensors: {
        sensor_type: string;
        monitoring_point: string;
    }
}


export function sortMachineData(machineData: MachineDataArray, currentFilter: string) {
    let data = [...machineData];
    switch (currentFilter) {
        case 'Nomes das Máquinas (A-Z)':
            data.sort((a, b) => a.machine_name.localeCompare(b.machine_name));
            break;
        case 'Tipo de sensor':
            data.sort((a, b) => {
                const sensorTypeA = a.sensors.sensor_type || "";
                const sensorTypeB = b.sensors.sensor_type || "";
                if (sensorTypeA === sensorTypeB) {
                    return a.machine_name.localeCompare(b.machine_name); // Secondary sort by machine name
                }
                return sensorTypeA.localeCompare(sensorTypeB);
            });
            break;
        case 'Tipo de máquina':
            data.sort((a, b) => {
                const machineTypeA = a.machine_type || "";
                const machineTypeB = b.machine_type || "";
                if (machineTypeA === machineTypeB) {
                    return a.machine_name.localeCompare(b.machine_name); // Secondary sort by machine name
                }
                return machineTypeA.localeCompare(machineTypeB);
            });
            break;
        case 'Ponto de monitoramento':
            data.sort((a, b) => {
                const monitoringPointA = a.sensors.monitoring_point || "";
                const monitoringPointB = b.sensors.monitoring_point || "";
                return monitoringPointA.localeCompare(monitoringPointB);
            });
            break;
        case 'Mais recentes':
            data.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
            break;
        default:
            break;
    }
    return data;
}