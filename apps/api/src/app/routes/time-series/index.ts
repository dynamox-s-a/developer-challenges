import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const timeSeriesPointSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    sensorId: { type: 'string' },
    value: { type: 'number' },
    timestamp: { type: 'string', format: 'date-time' },
  },
};

export default async function (fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['sensorId', 'value', 'timestamp'],
          properties: {
            sensorId: { type: 'string' },
            value: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        response: {
          201: timeSeriesPointSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: { sensorId: string; value: number; timestamp: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await fastify.timeSeriesService.create(request.body);
        return reply.status(201).send(result);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.post(
    '/batch',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: {
          type: 'array',
          items: {
            type: 'object',
            required: ['sensorId', 'value', 'timestamp'],
            properties: {
              sensorId: { type: 'string' },
              value: { type: 'number' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              count: { type: 'number' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: { sensorId: string; value: number; timestamp: string }[];
      }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await fastify.timeSeriesService.createMany(request.body);
        return reply.status(201).send(result);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['sensorId'],
          properties: {
            sensorId: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: timeSeriesPointSchema,
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { sensorId: string; startDate?: string; endDate?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        return await fastify.timeSeriesService.findBySensorId(request.query);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.get(
    '/metrics',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['sensorId'],
          properties: {
            sensorId: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sensorId: { type: 'string' },
              totalDataPoints: { type: 'number' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: { sensorId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        return await fastify.timeSeriesService.getMetrics(request.query.sensorId);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.get(
    '/prediction',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['sensorId'],
          properties: {
            sensorId: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              sensorId: { type: 'string' },
              predictedValue: { type: 'number' },
              nextTimestamp: { type: 'string', format: 'date-time' },
              confidence: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: { sensorId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        return await fastify.timeSeriesService.predictNext(request.query.sensorId);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.delete(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        querystring: {
          type: 'object',
          required: ['sensorId'],
          properties: {
            sensorId: { type: 'string' },
          },
        },
        response: {
          204: { type: 'null' },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: { sensorId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        await fastify.timeSeriesService.deleteBySensorId(request.query.sensorId);
        return reply.status(204).send();
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );
}
