import { Injectable } from '@nestjs/common';
import { prisma, redis } from '@source/persistence';

@Injectable()
export class TelemetryService {
  async getMetrics() {
    // Total count from Redis (updated by worker)
    const count = await redis.get('telemetry:global:total_count');
    return {
      total_telemetry_count: count ? parseInt(count) : 0,
    };
  }

  async getHistoryBySensor(sensorId: string) {
    return prisma.telemetry.findMany({
      where: { sensorId },
      orderBy: { timestamp: 'desc' },
      take: 100, // Return last 100 points
    });
  }

  async findAll(page = 1, limit = 10, sortField?: string, sortOrder: 'asc' | 'desc' = 'desc') {
    const skip = (page - 1) * limit;

    let orderBy: any = { timestamp: 'desc' };

    if (sortField) {
      if (sortField === 'sensorName') {
        orderBy = {
          sensor: {
            monitoringPoint: {
              name: sortOrder,
            },
          },
        };
      } else {
        orderBy = { [sortField]: sortOrder };
      }
    }

    const [items, total] = await Promise.all([
      prisma.telemetry.findMany({
        skip,
        take: limit,
        orderBy,
        include: {
          sensor: {
            include: {
              monitoringPoint: true,
            },
          },
        },
      }),
      prisma.telemetry.count(),
    ]);

    return { items, total, page, limit };
  }

  async deleteOne(id: number) {
    return prisma.telemetry.delete({
      where: { id },
    });
  }

  async deleteMany(ids: number[]) {
    return prisma.telemetry.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
