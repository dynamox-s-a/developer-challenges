import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, MachineType, SensorModel } from '@source/persistence';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class MonitoringPointsService {
  constructor(private readonly statsService: StatsService) {}

  async findAll(page = 1, limit = 10, sortBy = 'name', sortOrder: 'asc' | 'desc' = 'asc') {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.monitoringPoint.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { 
          machine: {
            include: {
              _count: {
                select: { monitoringPoints: true }
              }
            }
          }, 
          sensor: {
            include: {
              telemetry: {
                orderBy: { timestamp: 'desc' },
                take: 1
              }
            }
          }
        },
      }),
      prisma.monitoringPoint.count(),
    ]);

    return { items, total, page, limit };
  }

  async create(data: { name: string; machineId: number }) {
    const point = await prisma.monitoringPoint.create({
      data,
    });
    await this.statsService.broadcastMonitoringPointsCount();
    return point;
  }

  async findOne(id: number) {
    const point = await prisma.monitoringPoint.findUnique({
      where: { id },
      include: { machine: true, sensor: true },
    });
    if (!point) throw new NotFoundException('Monitoring point not found');
    return point;
  }

  async associateSensor(pointId: number, sensorData: { id: string; model: SensorModel }) {
    const point = await prisma.monitoringPoint.findUnique({
      where: { id: pointId },
      include: { machine: true },
    });

    if (!point) throw new NotFoundException('Monitoring point not found');

    // Business Rule: Pump type machines cannot be associated with TcAg or TcAs sensors.
    if (point.machine.type === MachineType.Pump && (sensorData.model === SensorModel.TcAg || sensorData.model === SensorModel.TcAs)) {
      throw new BadRequestException('Pump machines cannot use TcAg or TcAs sensors');
    }

    const sensor = await prisma.sensor.upsert({
      where: { monitoringPointId: pointId },
      update: { id: sensorData.id, model: sensorData.model },
      create: { 
        id: sensorData.id, 
        model: sensorData.model, 
        monitoringPointId: pointId 
      },
    });

    await this.statsService.broadcastMonitoringPointsCount();

    return sensor;
  }

  async remove(id: number) {
    const point = await prisma.monitoringPoint.findUnique({
      where: { id },
      include: { sensor: true },
    });

    if (!point) throw new NotFoundException('Monitoring point not found');

    // Business Rule: A machine must have at least two monitoring points.
    const count = await prisma.monitoringPoint.count({
      where: { machineId: point.machineId },
    });

    if (count <= 2) {
      throw new BadRequestException('A machine must have at least two monitoring points. Deletion prevented.');
    }

    await prisma.$transaction(async (tx) => {
      if (point.sensor) {
        // 1. Delete associated telemetry
        await tx.telemetry.deleteMany({
          where: { sensorId: point.sensor.id },
        });

        // 2. Delete associated sensor
        await tx.sensor.delete({
          where: { id: point.sensor.id },
        });
      }

      // 3. Delete the monitoring point
      await tx.monitoringPoint.delete({
        where: { id },
      });
    });

    await this.statsService.broadcastMonitoringPointsCount();
    return { success: true };
  }
}
