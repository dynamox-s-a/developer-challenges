import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SensorModel } from '@prisma/client';

const sensorSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    model: { type: 'string' },
    monitoringPointId: { type: 'string' },
    createdAt: { type: 'string' },
    monitoringPoint: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        machine: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string' },
          },
        },
      },
    },
  },
};

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        response: {
          200: {
            type: 'array',
            items: sensorSchema,
          },
        },
      },
    },
    async () => {
      return fastify.sensorService.findAll();
    }
  );

  fastify.get(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: sensorSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        return await fastify.sensorService.findById(request.params.id);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: {
          type: 'object',
          required: ['model', 'monitoringPointId'],
          properties: {
            model: { type: 'string', enum: ['TcAg', 'TcAs', 'HFPlus'] },
            monitoringPointId: { type: 'string' },
          },
        },
        response: {
          201: sensorSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: { model: SensorModel; monitoringPointId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const sensor = await fastify.sensorService.create(request.body);
        return reply.status(201).send(sensor);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.put(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            model: { type: 'string', enum: ['TcAg', 'TcAs', 'HFPlus'] },
          },
        },
        response: {
          200: sensorSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { model?: SensorModel } }>,
      reply: FastifyReply
    ) => {
      try {
        return await fastify.sensorService.update(request.params.id, request.body);
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          204: { type: 'null' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        await fastify.sensorService.delete(request.params.id);
        return reply.status(204).send();
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );
}
