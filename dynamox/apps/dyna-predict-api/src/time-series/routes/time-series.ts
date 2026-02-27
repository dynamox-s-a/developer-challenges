/**
 * @fileoverview Time Series routes. Handles machine lifecycle (list, create, delete).
 * All routes require authentication via the global preValidation hook.
 * Registered under the /v1/time-series prefix.
 */

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  CreateTimeSeriesBatchRequestSchema,
  DeleteTimeSeriesByRangeQuerySchema,
  DeleteTimeSeriesByUuidsRequestSchema,
  DeleteTimeSeriesByUuidsResponseSchema,
  TimeSeriesCountResponseSchema,
  TimeSeriesSensorParamsSchema,
  TimeSeriesListResponseSchema,
  TimeSeriesMetricsQuerySchema,
  TimeSeriesMetricsResponseSchema,
} from '@dynamox/types';
import { StatusCodes } from 'http-status-codes';
import { SENSOR_ERR_NOT_FOUND } from '../../shared/errors/errors';
import {
  createTimeSeriesEntries,
  deleteTimeSeriesByRange,
  deleteTimeSeriesByUuids,
  findSensorByUuid,
  getAllTimeSeriesCountBySensor,
  getAllTimeSeriesCountByUser,
  getTimeSeriesBySensor,
  getTimeSeriesMetrics,
} from '../data-access/time-series.repository';
import { resolveTimeSeriesDateRange } from '../domain/time-series.service';

const plugin: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.register(timeSeriesRoutes, { prefix: '/time-series' });
};

const timeSeriesRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.addHook('preValidation', fastify.authenticate);

  fastify.post(
    '/:sensorUuid',
    {
      schema: {
        tags: ['time-series'],
        description: 'Registra um lote de leituras de série temporal para o sensor especificado.',
        params: TimeSeriesSensorParamsSchema,
        body: CreateTimeSeriesBatchRequestSchema,
        response: {
          201: TimeSeriesListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sensorUuid } = request.params;
      const { sub: userId } = request.user;

      const sensor = await findSensorByUuid(fastify, sensorUuid, userId);
      if (!sensor) throw new SENSOR_ERR_NOT_FOUND();

      const created = await createTimeSeriesEntries(fastify, sensor.id, request.body);

      return reply.code(StatusCodes.CREATED).send({
        timeSeries: created.map(
          (entry: {
            uuid: string;
            temperature: number;
            accelerationRms: number;
            velocityRms: number;
            timestamp: Date;
          }) => ({
            ...entry,
            timestamp: entry.timestamp.toISOString(),
          }),
        ),
      });
    },
  );

  fastify.get(
    '/:sensorUuid/metrics',
    {
      schema: {
        tags: ['time-series'],
        description:
          'Retorna métricas (min, max, avg, count) das leituras do sensor no intervalo informado. Padrão: últimas 24 horas.',
        params: TimeSeriesSensorParamsSchema,
        querystring: TimeSeriesMetricsQuerySchema,
        response: {
          200: TimeSeriesMetricsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sensorUuid } = request.params;
      const { sub: userId } = request.user;
      const { startDate, endDate } = request.query;

      const sensor = await findSensorByUuid(fastify, sensorUuid, userId);
      if (!sensor) throw new SENSOR_ERR_NOT_FOUND();

      const dateRange = resolveTimeSeriesDateRange(startDate, endDate);

      const result = await getTimeSeriesMetrics(fastify, sensorUuid, userId, dateRange);

      return reply.send({
        temperature: {
          min: result._min.temperature,
          max: result._max.temperature,
          avg: result._avg.temperature,
        },
        accelerationRms: {
          min: result._min.accelerationRms,
          max: result._max.accelerationRms,
          avg: result._avg.accelerationRms,
        },
        velocityRms: {
          min: result._min.velocityRms,
          max: result._max.velocityRms,
          avg: result._avg.velocityRms,
        },
        count: result._count,
      });
    },
  );
  fastify.get(
    '/count',
    {
      schema: {
        tags: ['time-series'],
        description: 'Retorna o total de registros de série temporal do usuário autenticado.',
        response: {
          200: TimeSeriesCountResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;
      const result = await getAllTimeSeriesCountByUser(fastify, userId);
      return reply.send({ count: result._count });
    },
  );

  fastify.get(
    '/:sensorUuid/count',
    {
      schema: {
        tags: ['time-series'],
        description: 'Retorna o total de registros de série temporal do sensor especificado.',
        params: TimeSeriesSensorParamsSchema,
        response: {
          200: TimeSeriesCountResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sensorUuid } = request.params;
      const { sub: userId } = request.user;

      const sensor = await findSensorByUuid(fastify, sensorUuid, userId);
      if (!sensor) throw new SENSOR_ERR_NOT_FOUND();

      const result = await getAllTimeSeriesCountBySensor(fastify, sensorUuid, userId);
      return reply.send({ count: result._count });
    },
  );

  fastify.get(
    '/:sensorUuid',
    {
      schema: {
        tags: ['time-series'],
        description:
          'Retorna as leituras do sensor no intervalo informado, ordenadas por timestamp. Padrão: últimas 24 horas.',
        params: TimeSeriesSensorParamsSchema,
        querystring: TimeSeriesMetricsQuerySchema,
        response: {
          200: TimeSeriesListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sensorUuid } = request.params;
      const { sub: userId } = request.user;
      const { startDate, endDate } = request.query;

      const sensor = await findSensorByUuid(fastify, sensorUuid, userId);
      if (!sensor) throw new SENSOR_ERR_NOT_FOUND();

      const dateRange = resolveTimeSeriesDateRange(startDate, endDate);
      const entries = await getTimeSeriesBySensor(fastify, sensorUuid, userId, dateRange);

      return reply.send({
        timeSeries: entries.map(
          (entry: {
            uuid: string;
            temperature: number;
            accelerationRms: number;
            velocityRms: number;
            timestamp: Date;
          }) => ({
            ...entry,
            timestamp: entry.timestamp.toISOString(),
          }),
        ),
      });
    },
  );

  fastify.delete(
    '/:sensorUuid',
    {
      schema: {
        tags: ['time-series'],
        description: 'Deleta um lote de registros de série temporal pelos UUIDs informados.',
        params: TimeSeriesSensorParamsSchema,
        body: DeleteTimeSeriesByUuidsRequestSchema,
        response: {
          200: DeleteTimeSeriesByUuidsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sensorUuid } = request.params;
      const { sub: userId } = request.user;
      const { uuids } = request.body;

      const sensor = await findSensorByUuid(fastify, sensorUuid, userId);
      if (!sensor) throw new SENSOR_ERR_NOT_FOUND();

      const deleted = await deleteTimeSeriesByUuids(fastify, sensor.id, uuids);

      return reply.send({ requested: uuids.length, deleted });
    },
  );

  fastify.delete(
    '/:sensorUuid/range',
    {
      schema: {
        tags: ['time-series'],
        description:
          'Deleta registros de série temporal do sensor no intervalo de datas informado.',
        params: TimeSeriesSensorParamsSchema,
        querystring: DeleteTimeSeriesByRangeQuerySchema,
        response: {
          204: { type: 'null' },
        },
      },
    },
    async (request, reply) => {
      const { sensorUuid } = request.params;
      const { sub: userId } = request.user;
      const { startDate, endDate } = request.query;

      const sensor = await findSensorByUuid(fastify, sensorUuid, userId);
      if (!sensor) throw new SENSOR_ERR_NOT_FOUND();

      const dateRange = resolveTimeSeriesDateRange(startDate, endDate);

      await deleteTimeSeriesByRange(fastify, sensorUuid, userId, dateRange);

      return reply.code(StatusCodes.NO_CONTENT).send();
    },
  );
};

export default plugin;
