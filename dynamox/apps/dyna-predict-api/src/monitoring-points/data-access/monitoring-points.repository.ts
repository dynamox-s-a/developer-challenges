/**
 * @fileoverview Data access repository for the MonitoringPoint entity. Encapsulates all
 * database operations (reads and writes) and wraps Prisma errors into typed
 * application errors before propagating them up the stack.
 */

import { FastifyInstance } from 'fastify';
import type { MonitoringPointSortBy } from '@dynamox/types';
import { INTERNAL_SERVER_ERROR, withCause } from '../../shared/errors/errors';

function buildOrderBy(sortBy: MonitoringPointSortBy, sortOrder: 'asc' | 'desc') {
  switch (sortBy) {
    case 'name':
      return { name: sortOrder };
    case 'machineName':
      return { machine: { name: sortOrder } };
    case 'machineType':
      return { machine: { type: sortOrder } };
    case 'sensorModel':
      return { sensor: { model: sortOrder } };
  }
}

export async function getPaginatedMonitoringPoints(
  fastify: FastifyInstance,
  userId: number,
  page: number,
  pageSize: number,
  sortBy: MonitoringPointSortBy = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
) {
  try {
    const where = { machine: { userId } };
    const orderBy = buildOrderBy(sortBy, sortOrder);

    const [items, totalElements] = await Promise.all([
      fastify.prisma.monitoringPoint.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        select: {
          id: true,
          uuid: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          machine: {
            select: { uuid: true, name: true, type: true },
          },
          sensor: {
            select: { uuid: true, model: true },
          },
        },
      }),
      fastify.prisma.monitoringPoint.count({ where }),
    ]);

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      monitoringPoints: items,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalElements,
        hasNextPage: page < totalPages,
      },
    };
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function findMonitoringPointByUuid(
  fastify: FastifyInstance,
  uuid: string,
  userId: number,
) {
  return await fastify.prisma.monitoringPoint.findFirst({
    where: { uuid, machine: { userId } },
    select: {
      id: true,
      name: true,
      machine: { select: { id: true, type: true } },
    },
  });
}

export async function findExistingMonitoringPoint(
  fastify: FastifyInstance,
  name: string,
  machineId: number,
) {
  return await fastify.prisma.monitoringPoint.findUnique({
    where: { machineId_name: { machineId, name } },
    select: { id: true },
  });
}

export async function createMonitoringPoint(
  fastify: FastifyInstance,
  name: string,
  machineId: number,
  sensorModel?: string,
) {
  try {
    const createData = {
      name,
      machineId,
      ...(sensorModel ? { sensor: { create: { model: sensorModel } } } : {}),
    };

    return await fastify.prisma.monitoringPoint.create({
      data: createData,
      select: {
        id: true,
        uuid: true,
        name: true,
        createdAt: true,
        sensor: { select: { uuid: true, model: true } },
      },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function updateMonitoringPoint(
  fastify: FastifyInstance,
  uuid: string,
  name: string,
  sensorModel?: string,
) {
  try {
    return await fastify.prisma.monitoringPoint.update({
      where: { uuid },
      data: {
        name,
        ...(sensorModel
          ? {
              sensor: {
                upsert: { create: { model: sensorModel }, update: { model: sensorModel } },
              },
            }
          : {}),
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        updatedAt: true,
        sensor: { select: { uuid: true, model: true } },
      },
    });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function deleteMonitoringPointSensor(fastify: FastifyInstance, uuid: string) {
  try {
    await fastify.prisma.sensor.deleteMany({ where: { monitoringPoint: { uuid } } });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}

export async function deleteMonitoringPoint(fastify: FastifyInstance, uuid: string) {
  try {
    await fastify.prisma.monitoringPoint.delete({ where: { uuid } });
  } catch (error) {
    fastify.log.error(error);
    throw withCause(new INTERNAL_SERVER_ERROR(), error);
  }
}
