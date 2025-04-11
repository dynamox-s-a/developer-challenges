import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MonitoringPointService {
  constructor(private prisma: PrismaService) {}

  async create(createMonitoringPointDto: CreateMonitoringPointDto) {
    const { name, machineId, sensorModel } = createMonitoringPointDto;

    const machine = await this.prisma.machine.findUnique({
      where: { id: machineId },
    });

    if (!machine) {
      throw new Error('Máquina não encontrada');
    }

    if (
      machine.type === 'Pump' &&
      (sensorModel === 'TcAg' || sensorModel === 'TcAs')
    ) {
      throw new Error(
        'Sensores TcAg e TcAs não podem ser associados a máquinas do tipo Pump',
      );
    }

    const monitoringPoint = await this.prisma.monitoringPoint.create({
      data: {
        name,
        machineId,
        sensorModel,
        sensor: {
          create: {
            model: sensorModel,
          },
        },
      },
      include: {
        machine: true,
        sensor: true,
      },
    });

    return monitoringPoint;
  }

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc',
  ) {
    return this.prisma.monitoringPoint.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        machine: true,
        sensor: true,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} monitoringPoint`;
  }

  async update(id: string, data: UpdateMonitoringPointDto) {
    const existingMonitoringPoint =
      await this.prisma.monitoringPoint.findUnique({
        where: { id },
        include: { sensor: true, machine: true },
      });

    if (!existingMonitoringPoint) {
      throw new NotFoundException('Monitoring point not found');
    }

    if (
      data.sensorModel &&
      ['TcAg', 'TcAs'].includes(data.sensorModel) &&
      existingMonitoringPoint.machine.type === 'Pump'
    ) {
      throw new BadRequestException(
        'Sensores TcAg e TcAs não podem ser associados a máquinas do tipo Pump',
      );
    }

    const updatedMonitoringPoint = await this.prisma.monitoringPoint.update({
      where: { id },
      data: {
        name: data.name,
        machineId: data.machineId,
      },
      include: {
        machine: true,
        sensor: true,
      },
    });

    if (data.sensorModel) {
      if (existingMonitoringPoint.sensor) {
        await this.prisma.sensor.update({
          where: { id: existingMonitoringPoint.sensor.id },
          data: {
            model: data.sensorModel,
          },
        });
      } else {
        await this.prisma.sensor.create({
          data: {
            model: data.sensorModel,
            monitoringPointId: id,
          },
        });
      }
    }

    return updatedMonitoringPoint;
  }

  remove(id: string) {
    return `This action removes a #${id} monitoringPoint`;
  }
}
