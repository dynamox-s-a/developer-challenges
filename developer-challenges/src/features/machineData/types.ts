export interface MachineInfo {
	id: string;
	name: string;
	location: string;
	sensor: string;
	lastUpdate: string;
}

export interface RawSeriesPoint {
	datetime: string;
	max: number;
}

export interface RawSeries {
	name: string;
	data: RawSeriesPoint[];
}
