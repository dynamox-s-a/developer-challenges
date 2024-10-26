import { Injectable, NotFoundException } from '@nestjs/common';
import { MonitoringPoint } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';

@Injectable()
export class MonitoringPointsService {
  constructor(private prisma: PrismaService) {}

  async create(
    { machineId, name }: CreateMonitoringPointDto,
    userId: number
  ): Promise<MonitoringPoint | null> {
    try {
      return await this.prisma.monitoringPoint.create({
        data: {
          name,
          machine: {
            connect: {
              id: machineId,
              userId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async findAll(userId: number) {
    return await this.prisma.monitoringPoint.findMany({
      where: {
        userId,
      },
      include: {
        machine: true,
        sensor: true,
      },
    });
  }

  async remove(
    monitoringPointId: number,
    userId: number
  ): Promise<MonitoringPoint | null> {
    try {
      return await this.prisma.monitoringPoint.delete({
        where: {
          id: monitoringPointId,
          userId,
        },
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
