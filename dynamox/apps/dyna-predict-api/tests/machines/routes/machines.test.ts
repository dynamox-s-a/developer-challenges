import { describe, expect, vi } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import * as machineRepository from '../../../src/machines/data-access/machine.repository';
import { authenticatedTest } from '../../fixtures/fastify.fixture';
import { machineTest } from '../../fixtures/machine.fixture';

import { createErrorResponse } from '../../shared/errors';
import {
  MACHINE_ERR_ALREADY_EXISTS,
  MACHINE_ERR_NOT_FOUND,
} from '../../../src/shared/errors/errors';

describe('GET /v1/machines', () => {
  describe('when user has no machines', () => {
    authenticatedTest('should return empty machines list', async ({ fastify, authenticatedUser }) => {
      const spy = vi.spyOn(machineRepository, 'getMachines').mockResolvedValue([]);

      const response = await fastify.inject({
        method: 'GET',
        url: '/v1/machines',
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({ machines: [] });

      expect(spy).toHaveBeenCalledExactlyOnceWith(expect.anything(), authenticatedUser.sub);
    });
  });

  describe('when user has machines', () => {
    machineTest('should return machines list', async ({ fastify, authenticatedUser, mockMachineListItem }) => {
      const spy = vi.spyOn(machineRepository, 'getMachines').mockResolvedValue([mockMachineListItem]);

      const response = await fastify.inject({
        method: 'GET',
        url: '/v1/machines',
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        machines: [{
          ...mockMachineListItem,
          unassignedSensorCount: 1,
        }],
      });

      expect(spy).toHaveBeenCalledExactlyOnceWith(expect.anything(), authenticatedUser.sub);
    });
  });
});

describe('POST /v1/machines', () => {
  describe('when machine already exists', () => {
    machineTest('should throw MACHINE_ERR_ALREADY_EXISTS error', async ({ fastify, fake, authenticatedUser, mockMachine }) => {
      const findExistingMachineSpy = vi.spyOn(machineRepository, 'findExistingMachine').mockResolvedValue({ id: fake.id });

      const response = await fastify.inject({
        method: 'POST',
        url: '/v1/machines',
        body: { name: mockMachine.name, type: mockMachine.type },
      });

      expect(response.statusCode).toBe(StatusCodes.CONFLICT);
      expect(response.json()).toEqual(createErrorResponse(MACHINE_ERR_ALREADY_EXISTS));

      expect(findExistingMachineSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.name, mockMachine.type, authenticatedUser.sub);
    });
  });

  describe('when machine does not exist', () => {
    machineTest('should create and return the machine', async ({ fastify, authenticatedUser, mockMachine }) => {
      const createdAt = new Date();

      const findExistingMachineSpy = vi.spyOn(machineRepository, 'findExistingMachine').mockResolvedValue(null);
      const createMachineSpy = vi.spyOn(machineRepository, 'createMachine').mockResolvedValue({
        ...mockMachine,
        createdAt,
        updatedAt: createdAt,
      } as never);

      const response = await fastify.inject({
        method: 'POST',
        url: '/v1/machines',
        body: { name: mockMachine.name, type: mockMachine.type },
      });

      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.json()).toEqual({
        id: mockMachine.id,
        uuid: mockMachine.uuid,
        name: mockMachine.name,
        type: mockMachine.type,
        createdAt: createdAt.toISOString(),
      });

      expect(findExistingMachineSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.name, mockMachine.type, authenticatedUser.sub);
      expect(createMachineSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.name, mockMachine.type, authenticatedUser.sub);
    });
  });
});

describe('PATCH /v1/machines/:uuid', () => {
  describe('when machine is not found', () => {
    machineTest('should throw MACHINE_ERR_NOT_FOUND error', async ({ fastify, authenticatedUser, mockMachine }) => {
      const findExistingMachineByUuidSpy = vi.spyOn(machineRepository, 'findExistingMachineByUuid').mockResolvedValue(null);

      const response = await fastify.inject({
        method: 'PATCH',
        url: `/v1/machines/${mockMachine.uuid}`,
        body: { name: mockMachine.name },
      });

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.json()).toEqual(createErrorResponse(MACHINE_ERR_NOT_FOUND));

      expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.uuid, authenticatedUser.sub);
    });
  });

  describe('when another machine with the same name and type already exists', () => {
    machineTest('should throw MACHINE_ERR_ALREADY_EXISTS error', async ({ fastify, fake, authenticatedUser, mockMachine }) => {
      const findExistingMachineByUuidSpy = vi.spyOn(machineRepository, 'findExistingMachineByUuid').mockResolvedValue(mockMachine);
      const findExistingMachineSpy = vi.spyOn(machineRepository, 'findExistingMachine').mockResolvedValue({ id: mockMachine.id + 1 });

      const response = await fastify.inject({
        method: 'PATCH',
        url: `/v1/machines/${mockMachine.uuid}`,
        body: { name: fake.name, type: mockMachine.type },
      });

      expect(response.statusCode).toBe(StatusCodes.CONFLICT);
      expect(response.json()).toEqual(createErrorResponse(MACHINE_ERR_ALREADY_EXISTS));

      expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.uuid, authenticatedUser.sub);
      expect(findExistingMachineSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), fake.name, mockMachine.type, authenticatedUser.sub);
    });
  });

  describe('when machine is updated successfully', () => {
    machineTest('should return the updated machine', async ({ fastify, fake, authenticatedUser, mockMachine }) => {
      const updatedAt = new Date();
      const updatedName = fake.name;

      const findExistingMachineByUuidSpy = vi.spyOn(machineRepository, 'findExistingMachineByUuid').mockResolvedValue(mockMachine);
      const findExistingMachineSpy = vi.spyOn(machineRepository, 'findExistingMachine').mockResolvedValue(null);
      const updateMachineSpy = vi.spyOn(machineRepository, 'updateMachine').mockResolvedValue({
        ...mockMachine,
        name: updatedName,
        updatedAt,
      } as never);

      const response = await fastify.inject({
        method: 'PATCH',
        url: `/v1/machines/${mockMachine.uuid}`,
        body: { name: updatedName },
      });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.json()).toEqual({
        id: mockMachine.id,
        uuid: mockMachine.uuid,
        name: updatedName,
        type: mockMachine.type,
        updatedAt: updatedAt.toISOString(),
      });

      expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.uuid, authenticatedUser.sub);
      expect(findExistingMachineSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), updatedName, mockMachine.type, authenticatedUser.sub);
      expect(updateMachineSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.uuid, authenticatedUser.sub, updatedName, undefined);
    });
  });
});

describe('DELETE /v1/machines/:uuid', () => {
  describe('when machine is not found', () => {
    authenticatedTest('should throw MACHINE_ERR_NOT_FOUND error', async ({ fastify, fake, authenticatedUser }) => {

      const spy = vi.spyOn(machineRepository, 'findExistingMachineByUuid').mockResolvedValue(null);

      const response = await fastify.inject({
        method: 'DELETE',
        url: `/v1/machines/${fake.machineUuid}`,
      });

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.json()).toEqual(createErrorResponse(MACHINE_ERR_NOT_FOUND));

      expect(spy).toHaveBeenCalledExactlyOnceWith(expect.anything(), fake.machineUuid, authenticatedUser.sub);
    });
  });

  describe('when machine is found', () => {
    machineTest('should delete the machine', async ({ fastify, authenticatedUser, mockMachine }) => {

      const findExistingMachineByUuidSpy = vi.spyOn(machineRepository, 'findExistingMachineByUuid').mockResolvedValue(mockMachine);
      const deleteMachineSpy = vi.spyOn(machineRepository, 'deleteMachine').mockResolvedValue(undefined);

      const response = await fastify.inject({
        method: 'DELETE',
        url: `/v1/machines/${mockMachine.uuid}`,
      });

      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

      expect(findExistingMachineByUuidSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.uuid, authenticatedUser.sub);
      expect(deleteMachineSpy).toHaveBeenCalledExactlyOnceWith(expect.anything(), mockMachine.uuid);
    });
  });
});
