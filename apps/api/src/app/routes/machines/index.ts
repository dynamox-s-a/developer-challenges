import { FastifyInstance } from 'fastify';
import { MachineType } from '@prisma/client';

interface CreateMachineBody {
  name: string;
  type: MachineType;
}

interface UpdateMachineBody {
  name?: string;
  type?: MachineType;
}

interface MachineParams {
  id: string;
}

const machineSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    type: { type: 'string', enum: ['Pump', 'Fan'] },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
};

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'Listar todas as máquinas',
        response: {
          200: {
            type: 'array',
            items: machineSchema,
          },
        },
      },
    },
    async () => {
      return fastify.machineService.findAll();
    }
  );

  fastify.get<{ Params: MachineParams }>(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'Buscar máquina por ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: machineSchema,
        },
      },
    },
    async (request) => {
      try {
        return await fastify.machineService.findById(request.params.id);
      } catch {
        throw fastify.httpErrors.notFound('Machine not found');
      }
    }
  );

  fastify.post<{ Body: CreateMachineBody }>(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'Criar nova máquina',
        body: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: { type: 'string', minLength: 1 },
            type: { type: 'string', enum: ['Pump', 'Fan'] },
          },
        },
        response: {
          201: machineSchema,
        },
      },
    },
    async (request, reply) => {
      const machine = await fastify.machineService.create(request.body);
      return reply.status(201).send(machine);
    }
  );

  fastify.put<{ Params: MachineParams; Body: UpdateMachineBody }>(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'Atualizar máquina',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            type: { type: 'string', enum: ['Pump', 'Fan'] },
          },
        },
        response: {
          200: machineSchema,
        },
      },
    },
    async (request) => {
      try {
        return await fastify.machineService.update(request.params.id, request.body);
      } catch {
        throw fastify.httpErrors.notFound('Machine not found');
      }
    }
  );

  fastify.delete<{ Params: MachineParams }>(
    '/:id',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'Deletar máquina',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          204: { type: 'null' },
        },
      },
    },
    async (request, reply) => {
      try {
        await fastify.machineService.delete(request.params.id);
        return reply.status(204).send();
      } catch {
        throw fastify.httpErrors.notFound('Machine not found');
      }
    }
  );
}
