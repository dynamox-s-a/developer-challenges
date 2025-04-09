import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonitoringPointDto, UpdateMonitoringPointDto } from './dto';

@Injectable()
export class MonitoringPointService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMonitoringPointDto) {
    return this.prisma.monitoringPoint.create({ data: dto });
  }

  async findAll() {
    return this.prisma.monitoringPoint.findMany({
      include: { machine: true, sensor: true },
    });
  }

  async findById(id: number) {
    const point = await this.prisma.monitoringPoint.findUnique({
      where: { id },
      include: { machine: true, sensor: true },
    });
    if (!point) throw new NotFoundException('Monitoring point not found');
    return point;
  }

  async update(id: number, dto: UpdateMonitoringPointDto) {
    return this.prisma.monitoringPoint.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    return this.prisma.monitoringPoint.delete({ where: { id } });
  }
}
