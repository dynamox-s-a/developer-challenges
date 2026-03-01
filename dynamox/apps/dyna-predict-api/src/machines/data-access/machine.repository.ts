/**
 * @fileoverview Data access repository for the Machine entity. Encapsulates all
 * database operations (reads and writes) and wraps Prisma errors into typed
 * application errors before propagating them up the stack.
 */

import type { FastifyInstance } from 'fastify';
import type { MachinesListResponse } from '@dynamox/types';
import { INTERNAL_SERVER_ERROR, withCause } from '../../shared/errors/errors';

type MachineListItem = Omit<MachinesListResponse['machines'][number], 'unassignedSensorCount'>;

export async function getMachines(
  fastify: FastifyInstance,
  userId: number,
): Promise<MachineListItem[]> {
  try {
    return await fastify.prisma.machine.findMany({
      where: { userId },
      select: {
        id: true,
        uuid: true,
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        monitoringPoints: {
          select: {
            id: true,
            uuid: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            sensor: {
              select: { uuid: true, model: true },
            },
          },
        },
      },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function findExistingMachine(
  fastify: FastifyInstance,
  name: string,
  type: string,
  userId: number,
) {
  try {
    return await fastify.prisma.machine.findFirst({
      where: { userId, type, name: { equals: name, mode: 'insensitive' } },
      select: {
        id: true,
      },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function findExistingMachineByUuid(
  fastify: FastifyInstance,
  uuid: string,
  userId: number,
) {
  try {
    return await fastify.prisma.machine.findUnique({
      where: { userId, uuid },
      select: {
        id: true,
        uuid: true,
        name: true,
        type: true,
      },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function createMachine(
  fastify: FastifyInstance,
  name: string,
  type: string,
  userId: number,
) {
  try {
    return await fastify.prisma.machine.create({
      data: { name, type, userId },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function updateMachine(
  fastify: FastifyInstance,
  uuid: string,
  userId: number,
  name?: string,
  type?: string,
) {
  const updateData: { name?: string; type?: string } = {};

  if (name !== undefined) updateData['name'] = name;
  if (type !== undefined) updateData['type'] = type;

  try {
    return await fastify.prisma.machine.update({ where: { uuid, userId }, data: updateData });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function deleteMachine(fastify: FastifyInstance, uuid: string) {
  try {
    return await fastify.prisma.machine.delete({ where: { uuid } });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}
