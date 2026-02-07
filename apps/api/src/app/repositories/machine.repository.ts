import { FastifyInstance } from 'fastify';
import { MachineType } from '@prisma/client';

export interface CreateMachineData {
  name: string;
  type: MachineType;
}

export interface UpdateMachineData {
  name?: string;
  type?: MachineType;
}

export function createMachineRepository(fastify: FastifyInstance) {
  return {
    findAll: () => 
      fastify.prisma.machine.findMany({
        orderBy: { createdAt: 'desc' },
      }),

    findById: (id: string) => 
      fastify.prisma.machine.findUnique({ where: { id } }),

    create: (data: CreateMachineData) => 
      fastify.prisma.machine.create({ data }),

    update: (id: string, data: UpdateMachineData) => 
      fastify.prisma.machine.update({ where: { id }, data }),

    delete: (id: string) => 
      fastify.prisma.machine.delete({ where: { id } }),
  };
}

export type MachineRepository = ReturnType<typeof createMachineRepository>;
