/**
 * @fileoverview Monitoring Points routes. Handles monitoring point lifecycle (list, create, update, delete).
 * All routes require authentication via the global preValidation hook.
 * Registered under the /v1/monitoring-points prefix.
 */

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  CreateMonitoringPointRequestSchema,
  CreateMonitoringPointResponseSchema,
  MonitoringPointParamsSchema,
  MonitoringPointsQuerySchema,
  PaginatedMonitoringPointsListResponseSchema,
  PatchMonitoringPointRequestSchema,
  PatchMonitoringPointResponseSchema,
} from '@dynamox/types';
import { StatusCodes } from 'http-status-codes';
import { findExistingMachineByUuid } from '../../machines/data-access/machine.repository';
import {
  createMonitoringPoint,
  deleteMonitoringPoint,
  deleteMonitoringPointSensor,
  findExistingMonitoringPoint,
  findMonitoringPointByUuid,
  getPaginatedMonitoringPoints,
  updateMonitoringPoint,
} from '../data-access/monitoring-points.repository';
import {
  MACHINE_ERR_NOT_FOUND,
  MONITORING_POINT_ERR_ALREADY_EXISTS,
  MONITORING_POINT_ERR_NOT_FOUND,
  SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE,
} from '../../shared/errors/errors';
import { MONITORING_POINTS_DEFAULT_PAGE_SIZE } from '../domain/monitoring-points.constants';
import { isSensorForbiddenForMachine } from '../domain/monitoring-points.service';

const plugin: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.register(monitoringPointsRoutes, { prefix: '/monitoring-points' });
};

const monitoringPointsRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.addHook('preValidation', fastify.authenticate);

  fastify.get(
    '/',
    {
      schema: {
        tags: ['monitoring-points'],
        description:
          'Retorna uma lista paginada de pontos de monitoramento do usuário autenticado, ordenados por nome.',
        querystring: MonitoringPointsQuerySchema,
        response: {
          200: PaginatedMonitoringPointsListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;
      const page = request.query.page ?? 1;
      const pageSize = request.query.pageSize ?? MONITORING_POINTS_DEFAULT_PAGE_SIZE;
      const sortBy = request.query.sortBy;
      const sortOrder = request.query.sortOrder;

      const result = await getPaginatedMonitoringPoints(
        fastify,
        userId,
        page,
        pageSize,
        sortBy,
        sortOrder,
      );

      return reply.send(result);
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['monitoring-points'],
        description: 'Cria um novo ponto de monitoramento vinculado à máquina especificada.',
        body: CreateMonitoringPointRequestSchema,
        response: {
          201: CreateMonitoringPointResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, machineUuid, sensorModel } = request.body;
      const { sub: userId } = request.user;

      const machine = await findExistingMachineByUuid(fastify, machineUuid, userId);

      if (!machine) throw new MACHINE_ERR_NOT_FOUND();

      const existingMonitoringPoint = await findExistingMonitoringPoint(fastify, name, machine.id);
      if (existingMonitoringPoint) throw new MONITORING_POINT_ERR_ALREADY_EXISTS();

      if (sensorModel && isSensorForbiddenForMachine(machine.type, sensorModel)) {
        throw new SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE();
      }

      const monitoringPoint = await createMonitoringPoint(fastify, name, machine.id, sensorModel);

      return reply.code(StatusCodes.CREATED).send({
        id: monitoringPoint.id,
        uuid: monitoringPoint.uuid,
        name: monitoringPoint.name,
        createdAt: monitoringPoint.createdAt.toISOString(),
        sensor: monitoringPoint.sensor ?? undefined,
      });
    },
  );

  fastify.patch(
    '/:uuid',
    {
      schema: {
        tags: ['monitoring-points'],
        description: 'Atualiza o nome e/ou sensor de um ponto de monitoramento.',
        params: MonitoringPointParamsSchema,
        body: PatchMonitoringPointRequestSchema,
        response: {
          200: PatchMonitoringPointResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const { name, sensorModel } = request.body;
      const { sub: userId } = request.user;

      const monitoringPoint = await findMonitoringPointByUuid(fastify, uuid, userId);

      if (!monitoringPoint) throw new MONITORING_POINT_ERR_NOT_FOUND();

      if (name !== monitoringPoint.name) {
        const existingMonitoringPoint = await findExistingMonitoringPoint(
          fastify,
          name,
          monitoringPoint.machine.id,
        );
        if (existingMonitoringPoint) throw new MONITORING_POINT_ERR_ALREADY_EXISTS();
      }

      if (sensorModel && isSensorForbiddenForMachine(monitoringPoint.machine.type, sensorModel)) {
        throw new SENSOR_ERR_FORBIDDEN_FOR_MACHINE_TYPE();
      }

      const updated = await updateMonitoringPoint(fastify, uuid, name, sensorModel);

      return reply.send({
        id: updated.id,
        uuid: updated.uuid,
        name: updated.name,
        updatedAt: updated.updatedAt.toISOString(),
        sensor: updated.sensor ?? undefined,
      });
    },
  );

  fastify.delete(
    '/:uuid',
    {
      schema: {
        tags: ['monitoring-points'],
        description: 'Remove um ponto de monitoramento e seu sensor e séries temporais associados.',
        params: MonitoringPointParamsSchema,
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const { sub: userId } = request.user;

      const monitoringPoint = await findMonitoringPointByUuid(fastify, uuid, userId);

      if (!monitoringPoint) throw new MONITORING_POINT_ERR_NOT_FOUND();

      await deleteMonitoringPoint(fastify, uuid);

      return reply.code(StatusCodes.NO_CONTENT).send();
    },
  );

  fastify.delete(
    '/:uuid/sensor',
    {
      schema: {
        tags: ['monitoring-points'],
        description: 'Remove o sensor associado ao ponto de monitoramento.',
        params: MonitoringPointParamsSchema,
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const { sub: userId } = request.user;

      const monitoringPoint = await findMonitoringPointByUuid(fastify, uuid, userId);

      if (!monitoringPoint) throw new MONITORING_POINT_ERR_NOT_FOUND();

      await deleteMonitoringPointSensor(fastify, uuid);

      return reply.code(StatusCodes.NO_CONTENT).send();
    },
  );
};

export default plugin;
