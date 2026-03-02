/**
 * @fileoverview Reports routes. Exposes aggregated dashboard metrics for the authenticated user.
 * All routes require authentication via the preValidation hook.
 * Registered under the /v1/reports prefix.
 */

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { getDashboardMetrics } from '../data-access/reports.repository';
import {
  DashboardMetricsSchema
} from '@dynamox/types';
const plugin: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.register(reportRoutes, { prefix: '/reports' });
};

const reportRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.addHook('preValidation', fastify.authenticate);

  fastify.get(
    '/dashboard/metrics',
    {
      schema: {
        tags: ['reports'],
        description: 'Retorna as métricas agregadas do dashboard para o usuário autenticado: total de máquinas, pontos de monitoramento, sensores associados e registros de série temporal.',
        response: {
          200: DashboardMetricsSchema,
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;

      const result = await getDashboardMetrics(fastify, userId);

      return reply.send(result);
    },
  );

 };

export default plugin;
