import type { MeasurementsApiResponse } from '@/features/measurements/api/types';
import { mapMeasurements } from './mapper';

describe('mapMeasurements', () => {
	it('converts datetime ISO to UTC timestamp', () => {
		const raw: MeasurementsApiResponse = [
			{
				id: 'accelerationRms-x',
				name: 'accelerationRms/x',
				data: [{ datetime: '2023-11-07T11:53:38.187Z', max: 1.5 }],
			},
		];

		const result = mapMeasurements(raw);
		expect(result[0]?.data[0]?.timestamp).toBe(new Date('2023-11-07T11:53:38.187Z').getTime());
	});

	it('extracts metric and axis from "accelerationRms/x"', () => {
		const raw: MeasurementsApiResponse = [
			{ id: 'accelerationRms-x', name: 'accelerationRms/x', data: [] },
		];

		const result = mapMeasurements(raw);
		expect(result[0]?.metric).toBe('accelerationRms');
		expect(result[0]?.axis).toBe('x');
	});

	it('extracts metric and null axis from "temperature"', () => {
		const raw: MeasurementsApiResponse = [{ id: 'temperature', name: 'temperature', data: [] }];

		const result = mapMeasurements(raw);
		expect(result[0]?.metric).toBe('temperature');
		expect(result[0]?.axis).toBeNull();
	});

	it('assigns correct unit for each metric type', () => {
		const raw: MeasurementsApiResponse = [
			{ id: 'accelerationRms-x', name: 'accelerationRms/x', data: [] },
			{ id: 'velocityRms-y', name: 'velocityRms/y', data: [] },
			{ id: 'temperature', name: 'temperature', data: [] },
		];

		const result = mapMeasurements(raw);
		expect(result[0]?.unit).toBe('g');
		expect(result[1]?.unit).toBe('mm/s');
		expect(result[2]?.unit).toBe('°C');
	});

	it('preserves all data points', () => {
		const raw: MeasurementsApiResponse = [
			{
				id: 'temperature',
				name: 'temperature',
				data: [
					{ datetime: '2023-11-07T11:00:00.000Z', max: 22.1 },
					{ datetime: '2023-11-07T12:00:00.000Z', max: 23.4 },
					{ datetime: '2023-11-07T13:00:00.000Z', max: 21.8 },
				],
			},
		];

		const result = mapMeasurements(raw);
		expect(result[0]?.data).toHaveLength(3);
		expect(result[0]?.data[0]?.value).toBe(22.1);
		expect(result[0]?.data[2]?.value).toBe(21.8);
	});

	it('returns empty array for empty input', () => {
		const result = mapMeasurements([]);
		expect(result).toEqual([]);
	});
});
