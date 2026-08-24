export type Metric = 'accelerationRms' | 'velocityRms' | 'temperature';
export type Axis = 'x' | 'y' | 'z' | null;

export interface DataPoint {
	timestamp: number;
	value: number;
}

export interface MeasurementSeries {
	id: string;
	name: string;
	metric: Metric;
	axis: Axis;
	unit: string;
	data: DataPoint[];
}
