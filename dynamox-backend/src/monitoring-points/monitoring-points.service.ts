import { Injectable, BadRequestException } from '@nestjs/common';
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
        sensors: {
          create: {
            model: sensorModel,
          },
        },
      },
      include: {
        machine: true,
        sensors: true,
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
        sensors: true,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} monitoringPoint`;
  }

  update(id: string, updateMonitoringPointDto: UpdateMonitoringPointDto) {
    return `This action updates a #${id} monitoringPoint`;
  }

  remove(id: string) {
    return `This action removes a #${id} monitoringPoint`;
  }
}
