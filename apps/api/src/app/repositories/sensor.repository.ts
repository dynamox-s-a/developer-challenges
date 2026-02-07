import { FastifyInstance } from 'fastify';
import { SensorModel } from '@prisma/client';

export interface CreateSensorData {
  model: SensorModel;
  monitoringPointId: string;
}

export interface UpdateSensorData {
  model?: SensorModel;
}

export function createSensorRepository(fastify: FastifyInstance) {
  return {
    findAll: () =>
      fastify.prisma.sensor.findMany({
        include: { monitoringPoint: { include: { machine: true } } },
        orderBy: { createdAt: 'desc' },
      }),

    findById: (id: string) =>
      fastify.prisma.sensor.findUnique({
        where: { id },
        include: { monitoringPoint: { include: { machine: true } } },
      }),

    findByMonitoringPointId: (monitoringPointId: string) =>
      fastify.prisma.sensor.findUnique({
        where: { monitoringPointId },
        include: { monitoringPoint: { include: { machine: true } } },
      }),

    create: (data: CreateSensorData) =>
      fastify.prisma.sensor.create({
        data,
        include: { monitoringPoint: { include: { machine: true } } },
      }),

    update: (id: string, data: UpdateSensorData) =>
      fastify.prisma.sensor.update({
        where: { id },
        data,
        include: { monitoringPoint: { include: { machine: true } } },
      }),

    delete: (id: string) =>
      fastify.prisma.sensor.delete({ where: { id } }),
  };
}

export type SensorRepository = ReturnType<typeof createSensorRepository>;
