import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const monitoringPointSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    machineId: { type: 'string' },
    createdAt: { type: 'string' },
    machine: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
      },
    },
    sensor: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'string' },
        model: { type: 'string' },
      },
    },
  },
};

const paginatedResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: monitoringPointSchema,
    },
    meta: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
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
        querystring: {
          type: 'object',
          properties: {
            machineId: { type: 'string' },
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, default: 5 },
            sortBy: { type: 'string', enum: ['name', 'machineName', 'machineType', 'sensorModel'] },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
        },
        response: {
          200: {
            oneOf: [
              paginatedResponseSchema,
              { type: 'array', items: monitoringPointSchema },
            ],
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          machineId?: string;
          page?: number;
          limit?: number;
          sortBy?: string;
          sortOrder?: 'asc' | 'desc';
        };
      }>
    ) => {
      if (request.query.machineId) {
        return fastify.monitoringPointService.findByMachineId(request.query.machineId);
      }
      return fastify.monitoringPointService.findAll(request.query);
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
          200: monitoringPointSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        return await fastify.monitoringPointService.findById(request.params.id);
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
          required: ['name', 'machineId'],
          properties: {
            name: { type: 'string' },
            machineId: { type: 'string' },
          },
        },
        response: {
          201: monitoringPointSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: { name: string; machineId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const point = await fastify.monitoringPointService.create(request.body);
        return reply.status(201).send(point);
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
            name: { type: 'string' },
          },
        },
        response: {
          200: monitoringPointSchema,
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { name?: string } }>,
      reply: FastifyReply
    ) => {
      try {
        return await fastify.monitoringPointService.update(request.params.id, request.body);
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
        await fastify.monitoringPointService.delete(request.params.id);
        return reply.status(204).send();
      } catch (error: any) {
        return reply.status(error.statusCode || 500).send({ message: error.message });
      }
    }
  );
}
