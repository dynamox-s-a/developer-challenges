import { describe, expect, vi } from 'vitest';
import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import * as machineRepository from '../../../src/machines/data-access/machine.repository';
import * as monitoringPointsRepository from '../../../src/monitoring-points/data-access/monitoring-points.repository';
import * as monitoringPointsService from '../../../src/monitoring-points/domain/monitoring-points.service';
import { authenticatedTest } from '../../fixtures/fastify.fixture';
import { machineTest } from '../../fixtures/machine.fixture';
import { createErrorResponse } from '../../shared/errors';
import {
  MACHINE_ERR_NOT_FOUND,
  MONITORING_POINT_ERR_ALREADY_EXISTS,
  MONITORING_POINT_ERR_NOT_FOUND,
  SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE,
} from '../../../src/shared/errors/errors';

describe('GET /v1/monitoring-points', () => {
  describe('when user has no monitoring points', () => {
    authenticatedTest('should return empty list', async ({ fastify, authenticatedUser }) => {
      const mockResult = {
        monitoringPoints: [],
        pagination: {
          currentPage: 1,
          pageSize: 5,
          totalPages: 0,
          totalElements: 0,
          hasNextPage: false,
        },
      };
      const expectedResult = structuredClone(mockResult);

      const getPaginatedMonitoringPointsSpy = vi
        .spyOn(monitoringPointsRepository, 'getPaginatedMonitoringPoints')
        .mockResolvedValue(mockResult);

      const response = await fastify.inject({ method: 'GET', url: '/v1/monitoring-points' });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual(expectedResult);

      expect(getPaginatedMonitoringPointsSpy).toHaveBeenCalledExactlyOnceWith(
        expect.anything(),
        authenticatedUser.sub,
        1,
        5,
        undefined,
        undefined,
      );
    });
  });

  describe('when user has monitoring points', () => {
    machineTest(
      'should return paginated list',
      async ({ fastify, authenticatedUser, mockMonitoringPointListItem }) => {
        const mockResult = {
          monitoringPoints: [mockMonitoringPointListItem],
          pagination: {
            currentPage: 1,
            pageSize: 5,
            totalPages: 1,
            totalElements: 1,
            hasNextPage: false,
          },
        };
        const expectedResult = structuredClone(mockResult);

        const getPaginatedMonitoringPointsSpy = vi
          .spyOn(monitoringPointsRepository, 'getPaginatedMonitoringPoints')
          .mockResolvedValue(mockResult);

        const response = await fastify.inject({ method: 'GET', url: '/v1/monitoring-points' });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual(expectedResult);

        expect(getPaginatedMonitoringPointsSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          authenticatedUser.sub,
          1,
          5,
          undefined,
          undefined,
        );
      },
    );
  });
});

describe('POST /v1/monitoring-points', () => {
  describe('when machine is not found', () => {
    machineTest(
      'should throw MACHINE_ERR_NOT_FOUND error',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const findExistingMachineByUuidSpy = vi
          .spyOn(machineRepository, 'findExistingMachineByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'POST',
          url: '/v1/monitoring-points',
          body: { name: fake.name, machineUuid: mockMachine.uuid },
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(MACHINE_ERR_NOT_FOUND));

        expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          mockMachine.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when monitoring point already exists', () => {
    machineTest(
      'should throw MONITORING_POINT_ERR_ALREADY_EXISTS error',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const findExistingMachineByUuidSpy = vi
          .spyOn(machineRepository, 'findExistingMachineByUuid')
          .mockResolvedValue(mockMachine);
        const findExistingMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'findExistingMonitoringPoint')
          .mockResolvedValue({ id: fake.id });

        const response = await fastify.inject({
          method: 'POST',
          url: '/v1/monitoring-points',
          body: { name: fake.name, machineUuid: mockMachine.uuid },
        });

        expect(response.statusCode).toBe(StatusCodes.CONFLICT);
        expect(response.json()).toEqual(createErrorResponse(MONITORING_POINT_ERR_ALREADY_EXISTS));

        expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          mockMachine.uuid,
          authenticatedUser.sub,
        );
        expect(findExistingMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.name,
          mockMachine.id,
        );
      },
    );
  });

  describe('when sensor is forbidden for machine type', () => {
    machineTest(
      'should throw SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE error',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const findExistingMachineByUuidSpy = vi
          .spyOn(machineRepository, 'findExistingMachineByUuid')
          .mockResolvedValue(mockMachine);
        const findExistingMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'findExistingMonitoringPoint')
          .mockResolvedValue(null);
        const isSensorForbiddenForMachineSpy = vi
          .spyOn(monitoringPointsService, 'isSensorForbiddenForMachine')
          .mockReturnValue(true);

        const response = await fastify.inject({
          method: 'POST',
          url: '/v1/monitoring-points',
          body: { name: fake.name, machineUuid: mockMachine.uuid, sensorModel: 'TcAg' },
        });

        expect(response.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(response.json()).toEqual(createErrorResponse(SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE));

        expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          mockMachine.uuid,
          authenticatedUser.sub,
        );
        expect(findExistingMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.name,
          mockMachine.id,
        );
        expect(isSensorForbiddenForMachineSpy).toHaveBeenCalledExactlyOnceWith(
          mockMachine.type,
          'TcAg',
        );
      },
    );
  });

  describe('when monitoring point is created successfully', () => {
    describe('without sensor', () => {
      machineTest(
        'should return the created monitoring point',
        async ({ fastify, fake, authenticatedUser, mockMachine }) => {
          const createdAt = dayjs().toDate();
          const mockCreated = {
            id: fake.id,
            uuid: fake.uuid,
            name: fake.name,
            createdAt,
            sensor: null,
          };

          const findExistingMachineByUuidSpy = vi
            .spyOn(machineRepository, 'findExistingMachineByUuid')
            .mockResolvedValue(mockMachine);
          const findExistingMonitoringPointSpy = vi
            .spyOn(monitoringPointsRepository, 'findExistingMonitoringPoint')
            .mockResolvedValue(null);
          const createMonitoringPointSpy = vi
            .spyOn(monitoringPointsRepository, 'createMonitoringPoint')
            .mockResolvedValue(mockCreated);

          const response = await fastify.inject({
            method: 'POST',
            url: '/v1/monitoring-points',
            body: { name: fake.name, machineUuid: mockMachine.uuid },
          });

          expect(response.statusCode).toBe(StatusCodes.CREATED);
          expect(response.json()).toEqual({
            id: mockCreated.id,
            uuid: mockCreated.uuid,
            name: mockCreated.name,
            createdAt: createdAt.toISOString(),
          });

          expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(
            expect.anything(),
            mockMachine.uuid,
            authenticatedUser.sub,
          );
          expect(findExistingMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
            expect.anything(),
            fake.name,
            mockMachine.id,
          );
          expect(createMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
            expect.anything(),
            fake.name,
            mockMachine.id,
            undefined,
          );
        },
      );
    });

    describe('with sensor', () => {
      machineTest(
        'should return the created monitoring point with sensor',
        async ({ fastify, fake, authenticatedUser, mockMachine }) => {
          const sensorModel = 'HFPlus';
          const createdAt = dayjs().toDate();
          const mockCreated = {
            id: fake.id,
            uuid: fake.uuid,
            name: fake.name,
            createdAt,
            sensor: { uuid: fake.uuid, model: sensorModel },
          };

          const findExistingMachineByUuidSpy = vi
            .spyOn(machineRepository, 'findExistingMachineByUuid')
            .mockResolvedValue(mockMachine);
          const findExistingMonitoringPointSpy = vi
            .spyOn(monitoringPointsRepository, 'findExistingMonitoringPoint')
            .mockResolvedValue(null);
          const isSensorForbiddenForMachineSpy = vi
            .spyOn(monitoringPointsService, 'isSensorForbiddenForMachine')
            .mockReturnValue(false);
          const createMonitoringPointSpy = vi
            .spyOn(monitoringPointsRepository, 'createMonitoringPoint')
            .mockResolvedValue(mockCreated);

          const response = await fastify.inject({
            method: 'POST',
            url: '/v1/monitoring-points',
            body: { name: fake.name, machineUuid: mockMachine.uuid, sensorModel },
          });

          expect(response.statusCode).toBe(StatusCodes.CREATED);
          expect(response.json()).toEqual({
            id: mockCreated.id,
            uuid: mockCreated.uuid,
            name: mockCreated.name,
            createdAt: createdAt.toISOString(),
            sensor: mockCreated.sensor,
          });

          expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(
            expect.anything(),
            mockMachine.uuid,
            authenticatedUser.sub,
          );
          expect(findExistingMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
            expect.anything(),
            fake.name,
            mockMachine.id,
          );
          expect(isSensorForbiddenForMachineSpy).toHaveBeenCalledExactlyOnceWith(
            mockMachine.type,
            sensorModel,
          );
          expect(createMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
            expect.anything(),
            fake.name,
            mockMachine.id,
            sensorModel,
          );
        },
      );
    });
  });
});

describe('PATCH /v1/monitoring-points/:uuid', () => {
  describe('when monitoring point is not found', () => {
    authenticatedTest(
      'should throw MONITORING_POINT_ERR_NOT_FOUND error',
      async ({ fastify, fake, authenticatedUser }) => {
        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'PATCH',
          url: `/v1/monitoring-points/${fake.uuid}`,
          body: { name: fake.name },
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(MONITORING_POINT_ERR_NOT_FOUND));

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when monitoring point name already exists in the same machine', () => {
    machineTest(
      'should throw MONITORING_POINT_ERR_ALREADY_EXISTS error',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const existingPoint = {
          id: fake.id,
          name: 'existing-name',
          machine: { id: mockMachine.id, type: mockMachine.type },
          sensor: null,
        };

        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue(existingPoint);
        const findExistingMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'findExistingMonitoringPoint')
          .mockResolvedValue({ id: fake.id + 1 });

        const response = await fastify.inject({
          method: 'PATCH',
          url: `/v1/monitoring-points/${fake.uuid}`,
          body: { name: fake.name },
        });

        expect(response.statusCode).toBe(StatusCodes.CONFLICT);
        expect(response.json()).toEqual(createErrorResponse(MONITORING_POINT_ERR_ALREADY_EXISTS));

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(findExistingMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.name,
          mockMachine.id,
        );
      },
    );
  });

  describe('when sensor is forbidden for machine type', () => {
    machineTest(
      'should throw SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE error',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const existingPoint = {
          id: fake.id,
          name: 'existing-name',
          machine: { id: mockMachine.id, type: mockMachine.type },
          sensor: null,
        };

        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue({ ...existingPoint, name: fake.name });
        const isSensorForbiddenForMachineSpy = vi
          .spyOn(monitoringPointsService, 'isSensorForbiddenForMachine')
          .mockReturnValue(true);

        const response = await fastify.inject({
          method: 'PATCH',
          url: `/v1/monitoring-points/${fake.uuid}`,
          body: { name: fake.name, sensorModel: 'TcAg' },
        });

        expect(response.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(response.json()).toEqual(createErrorResponse(SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE));

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(isSensorForbiddenForMachineSpy).toHaveBeenCalledExactlyOnceWith(
          mockMachine.type,
          'TcAg',
        );
      },
    );
  });

  describe('when monitoring point is updated successfully', () => {
    machineTest(
      'should return the updated monitoring point',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const existingPoint = {
          id: fake.id,
          name: 'existing-name',
          machine: { id: mockMachine.id, type: mockMachine.type },
          sensor: null,
        };
        const updatedAt = dayjs().toDate();
        const updatedName = fake.name;
        const mockUpdated = {
          id: fake.id,
          uuid: fake.uuid,
          name: updatedName,
          updatedAt,
          sensor: null,
        };

        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue(existingPoint);
        const findExistingMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'findExistingMonitoringPoint')
          .mockResolvedValue(null);
        const updateMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'updateMonitoringPoint')
          .mockResolvedValue(mockUpdated);

        const response = await fastify.inject({
          method: 'PATCH',
          url: `/v1/monitoring-points/${fake.uuid}`,
          body: { name: updatedName },
        });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual({
          id: mockUpdated.id,
          uuid: mockUpdated.uuid,
          name: mockUpdated.name,
          updatedAt: updatedAt.toISOString(),
        });

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(findExistingMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          updatedName,
          mockMachine.id,
        );
        expect(updateMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          updatedName,
          undefined,
          false,
        );
      },
    );
  });

  describe('when monitoring point has an existing sensor and no sensorModel is sent', () => {
    machineTest(
      'should delete the existing sensor',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const existingPoint = {
          id: fake.id,
          name: 'existing-name',
          machine: { id: mockMachine.id, type: mockMachine.type },
          sensor: null,
        };
        const updatedAt = dayjs().toDate();
        const updatedName = fake.name;
        const mockUpdated = {
          id: fake.id,
          uuid: fake.uuid,
          name: updatedName,
          updatedAt,
          sensor: null,
        };

        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue({ ...existingPoint, sensor: { id: fake.id } });
        const findExistingMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'findExistingMonitoringPoint')
          .mockResolvedValue(null);
        const updateMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'updateMonitoringPoint')
          .mockResolvedValue(mockUpdated);

        const response = await fastify.inject({
          method: 'PATCH',
          url: `/v1/monitoring-points/${fake.uuid}`,
          body: { name: updatedName },
        });

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.json()).toEqual({
          id: mockUpdated.id,
          uuid: mockUpdated.uuid,
          name: mockUpdated.name,
          updatedAt: updatedAt.toISOString(),
        });

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(findExistingMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          updatedName,
          mockMachine.id,
        );
        expect(updateMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          updatedName,
          undefined,
          true,
        );
      },
    );
  });
});

describe('DELETE /v1/monitoring-points/:uuid', () => {
  describe('when monitoring point is not found', () => {
    authenticatedTest(
      'should throw MONITORING_POINT_ERR_NOT_FOUND error',
      async ({ fastify, fake, authenticatedUser }) => {
        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'DELETE',
          url: `/v1/monitoring-points/${fake.uuid}`,
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(MONITORING_POINT_ERR_NOT_FOUND));

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when monitoring point is found', () => {
    machineTest(
      'should delete the monitoring point',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const existingPoint = {
          id: fake.id,
          name: 'existing-name',
          machine: { id: mockMachine.id, type: mockMachine.type },
          sensor: null,
        };

        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue(existingPoint);
        const deleteMonitoringPointSpy = vi
          .spyOn(monitoringPointsRepository, 'deleteMonitoringPoint')
          .mockResolvedValue(undefined);

        const response = await fastify.inject({
          method: 'DELETE',
          url: `/v1/monitoring-points/${fake.uuid}`,
        });

        expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(deleteMonitoringPointSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
        );
      },
    );
  });
});

describe('DELETE /v1/monitoring-points/:uuid/sensor', () => {
  describe('when monitoring point is not found', () => {
    authenticatedTest(
      'should throw MONITORING_POINT_ERR_NOT_FOUND error',
      async ({ fastify, fake, authenticatedUser }) => {
        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue(null);

        const response = await fastify.inject({
          method: 'DELETE',
          url: `/v1/monitoring-points/${fake.uuid}/sensor`,
        });

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        expect(response.json()).toEqual(createErrorResponse(MONITORING_POINT_ERR_NOT_FOUND));

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
      },
    );
  });

  describe('when monitoring point is found', () => {
    machineTest(
      'should delete the sensor',
      async ({ fastify, fake, authenticatedUser, mockMachine }) => {
        const existingPoint = {
          id: fake.id,
          name: 'existing-name',
          machine: { id: mockMachine.id, type: mockMachine.type },
          sensor: null,
        };

        const findMonitoringPointByUuidSpy = vi
          .spyOn(monitoringPointsRepository, 'findMonitoringPointByUuid')
          .mockResolvedValue(existingPoint);
        const deleteMonitoringPointSensorSpy = vi
          .spyOn(monitoringPointsRepository, 'deleteMonitoringPointSensor')
          .mockResolvedValue(undefined);

        const response = await fastify.inject({
          method: 'DELETE',
          url: `/v1/monitoring-points/${fake.uuid}/sensor`,
        });

        expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

        expect(findMonitoringPointByUuidSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
          authenticatedUser.sub,
        );
        expect(deleteMonitoringPointSensorSpy).toHaveBeenCalledExactlyOnceWith(
          expect.anything(),
          fake.uuid,
        );
      },
    );
  });
});
