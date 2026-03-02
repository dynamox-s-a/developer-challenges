import { describe, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import * as timeSeriesRepository from '../../../src/time-series/data-access/time-series.repository';
import * as timeSeriesService from '../../../src/time-series/domain/time-series.service';
import { authenticatedTest } from '../../fixtures/fastify.fixture';
import { createErrorResponse } from '../../shared/errors';
import { SENSOR_ERR_NOT_FOUND } from '../../../src/shared/errors/errors';

function mockMetricFields() {
  return {
    temperature: faker.number.float({ min: 0, max: 100 }),
    accelerationRms: faker.number.float({ min: 0, max: 10 }),
    velocityRms: faker.number.float({ min: 0, max: 10 }),
  };
}

function mockAggregateResult() {
  return {
    _avg: mockMetricFields(),
    _max: mockMetricFields(),
    _min: mockMetricFields(),
    _count: faker.number.int({ min: 1, max: 100 }),
  };
}

describe('POST /v1/time-series/:sensorUuid', () => {
  describe('when sensor is not found', () => {
    authenticatedTest(
      'should return 404 SENSOR_ERR_NOT_FOUND',
      async ({ fastify, fake, authenticatedUser }) => {
        const findSensorByUuidSpy = vi
          .spyOn(timeSeriesRepository, 'findSensorByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'POST',
          url: `/v1/time-series/${fake.uuid}`,
          body: [{ temperature: 25.0, accelerationRms: 1.2, velocityRms: 0.5 }],
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(SENSOR_ERR_NOT_FOUND));

        expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when entries are created successfully', () => {
    authenticatedTest(
      'should return 201 with timeSeries and metrics',
      async ({ fastify, fake, authenticatedUser }) => {
        const timestamp = dayjs().toDate();
        const requestEntry = {
          temperature: faker.number.float({ min: 0, max: 100 }),
          accelerationRms: faker.number.float({ min: 0, max: 10 }),
          velocityRms: faker.number.float({ min: 0, max: 10 }),
        };
        const mockSensor = { id: fake.id };
        const mockCreated = [{ uuid: fake.uuid, ...requestEntry, timestamp }];
        const mockDateRange = { gte: dayjs().subtract(1, 'day').toDate(), lte: dayjs().toDate() };
        const mockMetrics = mockAggregateResult();

        const findSensorByUuidSpy = vi
          .spyOn(timeSeriesRepository, 'findSensorByUuid')
          .mockResolvedValue(mockSensor);
        const createTimeSeriesEntriesSpy = vi
          .spyOn(timeSeriesRepository, 'createTimeSeriesEntries')
          .mockResolvedValue(mockCreated);
        const resolveTimeSeriesDateRangeSpy = vi
          .spyOn(timeSeriesService, 'resolveTimeSeriesDateRange')
          .mockReturnValue(mockDateRange);
        const getTimeSeriesMetricsSpy = vi
          .spyOn(timeSeriesRepository, 'getTimeSeriesMetrics')
          .mockResolvedValue(mockMetrics);

        const response = await fastify.inject({
          method: 'POST',
          url: `/v1/time-series/${fake.uuid}`,
          body: [requestEntry],
        });

        expect(response.statusCode).toBe(StatusCodes.CREATED);
        expect(response.json()).toEqual({
          timeSeries: [{ uuid: fake.uuid, ...requestEntry, timestamp: timestamp.toISOString() }],
          metrics: {
            temperature: {
              min: mockMetrics._min.temperature,
              max: mockMetrics._max.temperature,
              avg: mockMetrics._avg.temperature,
            },
            accelerationRms: {
              min: mockMetrics._min.accelerationRms,
              max: mockMetrics._max.accelerationRms,
              avg: mockMetrics._avg.accelerationRms,
            },
            velocityRms: {
              min: mockMetrics._min.velocityRms,
              max: mockMetrics._max.velocityRms,
              avg: mockMetrics._avg.velocityRms,
            },
            count: mockMetrics._count,
          },
        });

        expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(createTimeSeriesEntriesSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          mockSensor.id,
          [requestEntry],
        );
        expect(resolveTimeSeriesDateRangeSpy).toHaveBeenCalledExactlyOnceWith();
        expect(getTimeSeriesMetricsSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
          mockDateRange,
        );
      },
    );
  });
});

describe('GET /v1/time-series/:sensorUuid/metrics', () => {
  describe('when sensor is not found', () => {
    authenticatedTest(
      'should return 404 SENSOR_ERR_NOT_FOUND',
      async ({ fastify, fake, authenticatedUser }) => {
        const findSensorByUuidSpy = vi
          .spyOn(timeSeriesRepository, 'findSensorByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'GET',
          url: `/v1/time-series/${fake.uuid}/metrics`,
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(SENSOR_ERR_NOT_FOUND));

        expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when metrics are returned', () => {
    authenticatedTest(
      'should return 200 with metrics',
      async ({ fastify, fake, authenticatedUser }) => {
        const mockDateRange = { gte: dayjs().subtract(1, 'day').toDate(), lte: dayjs().toDate() };
        const mockMetrics = mockAggregateResult();

        const findSensorByUuidSpy = vi
          .spyOn(timeSeriesRepository, 'findSensorByUuid')
          .mockResolvedValue({ id: fake.id });
        const resolveTimeSeriesDateRangeSpy = vi
          .spyOn(timeSeriesService, 'resolveTimeSeriesDateRange')
          .mockReturnValue(mockDateRange);
        const getTimeSeriesMetricsSpy = vi
          .spyOn(timeSeriesRepository, 'getTimeSeriesMetrics')
          .mockResolvedValue(mockMetrics);

        const response = await fastify.inject({
          method: 'GET',
          url: `/v1/time-series/${fake.uuid}/metrics`,
        });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual({
          temperature: {
            min: mockMetrics._min.temperature,
            max: mockMetrics._max.temperature,
            avg: mockMetrics._avg.temperature,
          },
          accelerationRms: {
            min: mockMetrics._min.accelerationRms,
            max: mockMetrics._max.accelerationRms,
            avg: mockMetrics._avg.accelerationRms,
          },
          velocityRms: {
            min: mockMetrics._min.velocityRms,
            max: mockMetrics._max.velocityRms,
            avg: mockMetrics._avg.velocityRms,
          },
          count: mockMetrics._count,
        });

        expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(resolveTimeSeriesDateRangeSpy).toHaveBeenCalledExactlyOnceWith(undefined, undefined);
        expect(getTimeSeriesMetricsSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
          mockDateRange,
        );
      },
    );
  });
});

describe('GET /v1/time-series/:sensorUuid', () => {
  describe('when sensor is not found', () => {
    authenticatedTest(
      'should return 404 SENSOR_ERR_NOT_FOUND',
      async ({ fastify, fake, authenticatedUser }) => {
        const findSensorByUuidSpy = vi
          .spyOn(timeSeriesRepository, 'findSensorByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'GET',
          url: `/v1/time-series/${fake.uuid}`,
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(SENSOR_ERR_NOT_FOUND));

        expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when time series are found', () => {
    authenticatedTest(
      'should return 200 with timeSeries entries',
      async ({ fastify, fake, authenticatedUser }) => {
        const timestamp = dayjs().toDate();
        const mockEntry = {
          uuid: fake.uuid,
          temperature: faker.number.float({ min: 0, max: 100 }),
          accelerationRms: faker.number.float({ min: 0, max: 10 }),
          velocityRms: faker.number.float({ min: 0, max: 10 }),
          timestamp,
        };
        const mockDateRange = { gte: dayjs().subtract(1, 'day').toDate(), lte: dayjs().toDate() };

        const findSensorByUuidSpy = vi
          .spyOn(timeSeriesRepository, 'findSensorByUuid')
          .mockResolvedValue({ id: fake.id });
        const resolveTimeSeriesDateRangeSpy = vi
          .spyOn(timeSeriesService, 'resolveTimeSeriesDateRange')
          .mockReturnValue(mockDateRange);
        const getTimeSeriesBySensorSpy = vi
          .spyOn(timeSeriesRepository, 'getTimeSeriesBySensor')
          .mockResolvedValue([mockEntry]);

        const response = await fastify.inject({
          method: 'GET',
          url: `/v1/time-series/${fake.uuid}`,
        });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual({
          timeSeries: [
            {
              uuid: mockEntry.uuid,
              temperature: mockEntry.temperature,
              accelerationRms: mockEntry.accelerationRms,
              velocityRms: mockEntry.velocityRms,
              timestamp: timestamp.toISOString(),
            },
          ],
        });

        expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(resolveTimeSeriesDateRangeSpy).toHaveBeenCalledExactlyOnceWith(undefined, undefined);
        expect(getTimeSeriesBySensorSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
          mockDateRange,
        );
      },
    );
  });
});

describe('DELETE /v1/time-series/:sensorUuid/all', () => {
  describe('when sensor is not found', () => {
    authenticatedTest(
      'should return 404 SENSOR_ERR_NOT_FOUND',
      async ({ fastify, fake, authenticatedUser }) => {
        const findSensorByUuidSpy = vi
          .spyOn(timeSeriesRepository, 'findSensorByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'DELETE',
          url: `/v1/time-series/${fake.uuid}/all`,
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(SENSOR_ERR_NOT_FOUND));

        expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when all time series are deleted', () => {
    authenticatedTest('should return 204', async ({ fastify, fake, authenticatedUser }) => {
      const findSensorByUuidSpy = vi
        .spyOn(timeSeriesRepository, 'findSensorByUuid')
        .mockResolvedValue({ id: fake.id });
      const deleteAllTimeSeriesBySensorSpy = vi
        .spyOn(timeSeriesRepository, 'deleteAllTimeSeriesBySensor')
        .mockResolvedValue(0);

      const response = await fastify.inject({
        method: 'DELETE',
        url: `/v1/time-series/${fake.uuid}/all`,
      });

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

      expect(findSensorByUuidSpy).toHaveBeenCalledExactlyOnceWith(
        expect.anything(),
        fake.uuid,
        authenticatedUser.sub,
      );
      expect(deleteAllTimeSeriesBySensorSpy).toHaveBeenCalledExactlyOnceWith(
        expect.anything(),
        fake.uuid,
        authenticatedUser.sub,
      );
    });
  });
});
