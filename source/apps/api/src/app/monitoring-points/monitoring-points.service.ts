import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, MachineType, SensorModel } from '@source/persistence';

@Injectable()
export class MonitoringPointsService {
  async findAll(page = 1, limit = 10, sortBy = 'name', sortOrder: 'asc' | 'desc' = 'asc') {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.monitoringPoint.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { 
          machine: true, 
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
    return prisma.monitoringPoint.create({
      data,
    });
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

    return prisma.sensor.upsert({
      where: { monitoringPointId: pointId },
      update: { id: sensorData.id, model: sensorData.model },
      create: { 
        id: sensorData.id, 
        model: sensorData.model, 
        monitoringPointId: pointId 
      },
    });
  }
}
