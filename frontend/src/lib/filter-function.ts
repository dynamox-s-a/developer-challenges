
export interface MachineData {
    machine_id: number;
    map: any;
    user_id: number;
    machine_type: string;
    machine_name: string;
    createdAt: string;
    updatedAt: string;
    monitors: {
        monitoring_point_id: number;
        monitoring_point_name: string;
        sensors: {
            sensor_type: string;
            monitoring_point: string;
        }[];
    }[];
}

export type MachineDataArray = MachineData[];


export function sortMachineData(machineData: MachineDataArray, currentFilter: string) {
    let data = [...machineData];
    console.log("Data", data);
    switch (currentFilter) {
        case 'Nomes das Máquinas (A-Z)':
            data.sort((a, b) => a.machine_name.localeCompare(b.machine_name));
            break;
        case 'Tipo de sensor':
            data.sort((a, b) => {
                const firstSensorA = a.monitors[0]?.sensors[0]?.sensor_type ?? '';
                const firstSensorB = b.monitors[0]?.sensors[0]?.sensor_type ?? '';
                return firstSensorA.localeCompare(firstSensorB);
            });
            break;
        case 'Tipo de máquina':
            data.sort((a, b) => a.machine_type.localeCompare(b.machine_type));
            break;
        case 'Ponto de monitoramento':
            data.sort((a, b) => {
                const monitoringPointNameA = a.monitors[0]?.monitoring_point_name ?? '';
                const monitoringPointNameB = b.monitors[0]?.monitoring_point_name ?? '';
                return monitoringPointNameA.localeCompare(monitoringPointNameB);
            });
            break;
        default:
            break;
    }
    return data;
}