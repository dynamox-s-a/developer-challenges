import { Injectable } from '@nestjs/common';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MonitoringPointService {
  constructor(private prisma: PrismaService) {}

  create(createMonitoringPointDto: CreateMonitoringPointDto) {
    return 'This action adds a new monitoringPoint';
  }

  findAll() {
    return this.prisma.monitoringPoint.findMany({
      include: {
        machine: true, // inclui info da máquina relacionada
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} monitoringPoint`;
  }

  update(id: number, updateMonitoringPointDto: UpdateMonitoringPointDto) {
    return `This action updates a #${id} monitoringPoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitoringPoint`;
  }
}
