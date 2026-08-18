export interface MachineInfo {
	machine: string;
	point: string;
	rpm: string;
	range: string;
	duration: string;
}

export interface RawSeriesPoint {
	datetime: string;
	max: number;
}

export interface RawSeries {
	name: string;
	data: RawSeriesPoint[];
}
