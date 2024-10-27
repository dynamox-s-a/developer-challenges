import { Injectable, NotFoundException } from '@nestjs/common';
import { MonitoringPoint } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';

@Injectable()
export class MonitoringPointsService {
  constructor(private prisma: PrismaService) {}

  async create(
    machineId: number,
    userId: number,
    { name }: CreateMonitoringPointDto
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
    return await this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .monitoringPoints({
        include: {
          machine: true,
          sensor: true,
        },
      });
  }

  async remove(
    machineId: number,
    userId: number,
    monitoringPointId: number
  ): Promise<MonitoringPoint | null> {
    try {
      return await this.prisma.monitoringPoint.delete({
        where: {
          machineId,
          userId,
          id: monitoringPointId,
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
