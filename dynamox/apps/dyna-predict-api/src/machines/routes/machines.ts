/**
 * @fileoverview Machines routes. Handles machine lifecycle (list, create, delete).
 * All routes require authentication via the global preValidation hook.
 * Registered under the /v1/machines prefix.
 */

import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  CreateMachineRequestSchema,
  CreateMachineResponseSchema,
  MachineParamsSchema,
  MachinesListResponseSchema,
  PatchMachineRequestSchema,
  PatchMachineResponseSchema,
} from '@dynamox/types';
import {
  createMachine,
  deleteMachine,
  findExistingMachine,
  findExistingMachineByUuid,
  getMachines,
  updateMachine,
} from '../data-access/machine.repository';
import { MACHINE_ERR_ALREADY_EXISTS, MACHINE_ERR_NOT_FOUND } from '../../shared/errors/errors';
import { StatusCodes } from 'http-status-codes';

const plugin: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.register(machinesRoutes, { prefix: '/machines' });
};

const machinesRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.addHook('preValidation', fastify.authenticate);

  fastify.get(
    '/',
    {
      schema: {
        tags: ['machines'],
        description:
          'Retorna todas as máquinas do usuário autenticado, incluindo seus pontos de monitoramento e sensores.',
        response: {
          200: MachinesListResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;

      const machines = await getMachines(fastify, userId);

      return reply.send({
        machines: machines.map((machine) => ({
          ...machine,
          monitoringPoints: machine.monitoringPoints.map((mp) => ({
            ...mp,
            sensor: mp.sensor ?? undefined,
          })),
          unassignedSensorCount: machine.monitoringPoints.filter((mp) => !mp.sensor).length,
        })),
      });
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['machines'],
        description:
          'Cria uma nova máquina. Retorna erro se já existir uma máquina com o mesmo nome e tipo.',
        body: CreateMachineRequestSchema,
        response: {
          201: CreateMachineResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const name = request.body.name.trim();
      const { type } = request.body;
      const { sub: userId } = request.user;

      const existingMachine = await findExistingMachine(fastify, name, type, userId);

      if (existingMachine) throw new MACHINE_ERR_ALREADY_EXISTS();

      const machine = await createMachine(fastify, name, type, userId);

      return reply.code(StatusCodes.CREATED).send({
        id: machine.id,
        uuid: machine.uuid,
        name: machine.name,
        type: machine.type,
        createdAt: machine.createdAt.toISOString(),
      });
    },
  );

  fastify.patch(
    '/:uuid',
    {
      schema: {
        tags: ['machines'],
        description:
          'Atualiza os dados de uma máquina. Retorna erro se a máquina não existir ou se o novo nome e tipo conflitarem com outra já existente.',
        params: MachineParamsSchema,
        body: PatchMachineRequestSchema,
        response: {
          200: PatchMachineResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const name = request.body.name?.trim();
      const { type } = request.body;
      const { sub: userId } = request.user;

      const machine = await findExistingMachineByUuid(fastify, uuid, userId);

      if (!machine) throw new MACHINE_ERR_NOT_FOUND();

      const existingMachine = await findExistingMachine(
        fastify,
        name ?? machine.name,
        type ?? machine.type,
        userId,
      );

      if (existingMachine && existingMachine.id !== machine.id) {
        throw new MACHINE_ERR_ALREADY_EXISTS();
      }

      const updatedMachine = await updateMachine(fastify, uuid, userId, name, type);

      return reply.send({
        id: updatedMachine.id,
        uuid: updatedMachine.uuid,
        name: updatedMachine.name,
        type: updatedMachine.type,
        updatedAt: updatedMachine.updatedAt.toISOString(),
      });
    },
  );

  fastify.delete(
    '/:uuid',
    {
      schema: {
        tags: ['machines'],
        description:
          'Remove uma máquina e todos os seus pontos de monitoramento e sensores associados.',
        params: MachineParamsSchema,
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const { sub: userId } = request.user;

      const machine = await findExistingMachineByUuid(fastify, uuid, userId);

      if (!machine) throw new MACHINE_ERR_NOT_FOUND();

      await deleteMachine(fastify, uuid);

      return reply.code(StatusCodes.NO_CONTENT).send();
    },
  );
};

export default plugin;
