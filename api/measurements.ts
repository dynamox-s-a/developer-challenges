import measurementsDatabase from '../mock/db.json' with { type: 'json' };
import type { MeasurementsApiResponse } from '../src/features/measurements/api/types.js';

const measurements: MeasurementsApiResponse = measurementsDatabase.measurements;

export function GET(): Response {
	return Response.json(measurements);
}
