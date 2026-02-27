/**
 * @fileoverview Fastify plugin that registers @fastify/swagger and @fastify/swagger-ui.
 * The OpenAPI spec is generated automatically from TypeBox schemas attached to routes.
 * Docs available at /docs when not in production.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'DynaPredict API',
        description: `API do Desafio Técnico Full Stack da Dynamox`,
        version: '1.0.0',
      },
      tags: [
        { name: 'auth', description: 'Autenticação' },
        { name: 'machines', description: 'Gerenciamento de máquinas' },
        { name: 'monitoring-points', description: 'Gerenciamento de pontos de monitoramento' },
        { name: 'health', description: 'Verificação de saúde da aplicação' },
      ],
      security: [{ cookieAuth: [] }],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'token',
          },
        },
      },
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    await fastify.register(SwaggerUI, {
      routePrefix: '/docs',
    });
  }
});
