import { describe, expect, vi } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import * as reportsRepository from '../../../src/reports/data-access/reports.repository';
import { authenticatedTest } from '../../fixtures/fastify.fixture';

describe('GET /v1/reports/dashboard/metrics', () => {
  describe('when metrics are fetched successfully', () => {
    authenticatedTest(
      'should return aggregated dashboard metrics',
      async ({ fastify, authenticatedUser }) => {
        const mockResult = {
          machineCount: 3,
          monitoringPointCount: 5,
          assignedSensorCount: 4,
          timeSeriesRecordCount: 100,
          machinesByType: [{ type: 'Pump', _count: { type: 2 } }],
          sensorDistribution: [{ model: 'HFPlus', _count: { model: 1 } }],
        };
        const expectedResult = structuredClone(mockResult);

        const getDashboardMetricsSpy = vi
          .spyOn(reportsRepository, 'getDashboardMetrics')
          .mockResolvedValue(mockResult);

        const response = await fastify.inject({ method: 'GET', url: '/v1/reports/dashboard/metrics' });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual(expectedResult);

        expect(getDashboardMetricsSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          authenticatedUser.sub,
        );
      },
    );
  });
});
