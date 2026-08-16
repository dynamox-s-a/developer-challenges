export interface MeasurementDataPoint {
	datetime: string;
	max: number;
}

export interface MeasurementRaw {
	id: string;
	name: string;
	data: MeasurementDataPoint[];
}

export type MeasurementsApiResponse = MeasurementRaw[];
