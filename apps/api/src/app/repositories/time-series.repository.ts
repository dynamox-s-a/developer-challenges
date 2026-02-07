import { FastifyInstance } from 'fastify';

export interface CreateTimeSeriesData {
  sensorId: string;
  value: number;
  timestamp: Date;
}

export interface FindTimeSeriesParams {
  sensorId: string;
  startDate?: Date;
  endDate?: Date;
}

export function createTimeSeriesRepository(fastify: FastifyInstance) {
  return {
    create: (data: CreateTimeSeriesData) =>
      fastify.prisma.timeSeries.create({
        data,
      }),

    createMany: (data: CreateTimeSeriesData[]) =>
      fastify.prisma.timeSeries.createMany({
        data,
      }),

    findBySensorId: (params: FindTimeSeriesParams) =>
      fastify.prisma.timeSeries.findMany({
        where: {
          sensorId: params.sensorId,
          timestamp: {
            gte: params.startDate,
            lte: params.endDate,
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      }),

    countBySensorId: (sensorId: string) =>
      fastify.prisma.timeSeries.count({
        where: { sensorId },
      }),

    deleteBySensorId: (sensorId: string) =>
      fastify.prisma.timeSeries.deleteMany({
        where: { sensorId },
      }),

    findLatest: (sensorId: string, limit: number) =>
      fastify.prisma.timeSeries.findMany({
        where: { sensorId },
        orderBy: { timestamp: 'desc' },
        take: limit,
      }),
  };
}

export type TimeSeriesRepository = ReturnType<typeof createTimeSeriesRepository>;
