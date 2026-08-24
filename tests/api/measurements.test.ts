import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { GET } from '../../api/measurements.js';
import measurementsDatabase from '../../mock/db.json' with { type: 'json' };

// Compact JSON SHA-256 of origin/main:response-challenge-v2.json.
const OFFICIAL_DATASET_SHA256 = '7de37942185526fc62a32f3ce6b7643763d3aaa162239751d4bc1beea4133777';

describe('GET /api/measurements', () => {
	it('returns the complete measurements collection as JSON', async () => {
		const response = GET();

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('application/json');
		expect(await response.json()).toEqual(measurementsDatabase.measurements);
		expect(measurementsDatabase.measurements).toHaveLength(7);
	});

	it('preserves the official dataset content with stable REST ids', () => {
		const normalizedMeasurements = measurementsDatabase.measurements.map((series) => ({
			name: series.name,
			data: series.data,
		}));
		const normalizedHash = createHash('sha256')
			.update(JSON.stringify(normalizedMeasurements))
			.digest('hex');
		const uniqueIds = new Set(measurementsDatabase.measurements.map((series) => series.id));

		expect(normalizedHash).toBe(OFFICIAL_DATASET_SHA256);
		expect(uniqueIds.size).toBe(7);
	});
});
