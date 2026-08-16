export interface MachineInfo {
	machineId: string;
	pointId: string;
	rpm: number;
	range: string;
	acquisitionInterval: string;
}

export const MACHINE_INFO: MachineInfo = {
	machineId: '1023',
	pointId: '20192',
	rpm: 200,
	range: '16g',
	acquisitionInterval: '20 min',
};
