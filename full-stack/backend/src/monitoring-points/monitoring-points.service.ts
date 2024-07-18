import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MachineType, SensorModel } from '@prisma/client';
import { CreateMonitoringPointsDto } from './dto/create-monitoring-points.dto';
import { AssociateSensorDto } from './dto/associate-sensor.dto';

@Injectable()
export class MonitoringPointsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMonitoringPoint(
    createMonitoringPointsDto: CreateMonitoringPointsDto,
  ) {
    return this.prisma.monitoringPoint.create({
      data: createMonitoringPointsDto,
      select: {
        id: true,
        machine: true,
        machineId: true,
        name: true,
        sensor: true,
      },
    });
  }

  async associateSensor(
    monitoringPointId: string,
    associateSensorDto: AssociateSensorDto,
  ) {
    const monitoringPoint = await this.prisma.monitoringPoint.findUnique({
      where: {
        id: monitoringPointId,
      },
      include: { machine: true },
    });

    if (!monitoringPoint)
      throw new BadRequestException('Monitoring point not found');

    if (
      monitoringPoint.machine.type === MachineType.Pump &&
      (associateSensorDto.modelName === SensorModel.TcAg ||
        associateSensorDto.modelName === SensorModel.TcAs)
    ) {
      throw new BadRequestException(
        'Cannot assign TcAg or TcAs sensors to Pump machines',
      );
    }

    return this.prisma.sensor.create({
      data: {
        monitoringPointId,
        modelName: associateSensorDto.modelName,
      },
    });
  }

  async getMonitoringPoints(page: number) {
    const monitoringPoints = await this.prisma.monitoringPoint.findMany({
      skip: (page - 1) * 5,
      take: 5,
      include: {
        machine: true,
        sensor: true,
      },
      orderBy: {
        name: 'desc',
      },
    });

    const totalCount = await this.prisma.monitoringPoint.count();

    return monitoringPoints.map((item) => ({
      ...item,
      totalCount,
    }));
  }
}
