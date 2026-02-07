import { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';

export interface CreateMonitoringPointData {
  name: string;
  machineId: string;
}

export interface UpdateMonitoringPointData {
  name?: string;
}

export interface FindAllParams {
  skip?: number;
  take?: number;
  orderBy?: Prisma.MonitoringPointOrderByWithRelationInput;
}

export function createMonitoringPointRepository(fastify: FastifyInstance) {
  return {
    findAll: (params?: FindAllParams) =>
      fastify.prisma.monitoringPoint.findMany({
        include: { machine: true, sensor: true },
        skip: params?.skip,
        take: params?.take,
        orderBy: params?.orderBy || { createdAt: 'desc' },
      }),

    count: () => fastify.prisma.monitoringPoint.count(),

    findByMachineId: (machineId: string) =>
      fastify.prisma.monitoringPoint.findMany({
        where: { machineId },
        include: { sensor: true },
        orderBy: { createdAt: 'desc' },
      }),

    findById: (id: string) =>
      fastify.prisma.monitoringPoint.findUnique({
        where: { id },
        include: { machine: true, sensor: true },
      }),

    create: (data: CreateMonitoringPointData) =>
      fastify.prisma.monitoringPoint.create({
        data,
        include: { machine: true },
      }),

    update: (id: string, data: UpdateMonitoringPointData) =>
      fastify.prisma.monitoringPoint.update({
        where: { id },
        data,
        include: { machine: true, sensor: true },
      }),

    delete: (id: string) =>
      fastify.prisma.monitoringPoint.delete({ where: { id } }),
  };
}

export type MonitoringPointRepository = ReturnType<typeof createMonitoringPointRepository>;
