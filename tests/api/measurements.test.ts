import { describe, expect, it } from 'vitest';
import { GET } from '../../api/measurements.js';
import measurementsDatabase from '../../mock/db.json' with { type: 'json' };

describe('GET /api/measurements', () => {
	it('returns the complete measurements collection as JSON', async () => {
		const response = GET();

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('application/json');
		expect(await response.json()).toEqual(measurementsDatabase.measurements);
		expect(measurementsDatabase.measurements).toHaveLength(7);
	});
});
