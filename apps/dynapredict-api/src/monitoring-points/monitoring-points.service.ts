import { Injectable, NotFoundException } from '@nestjs/common';
import { MonitoringPoint } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { QueryDto } from './get-all/query.dto';

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
    const { monitoringPoints } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        monitoringPoints: {
          include: {
            machine: true,
            sensor: true,
          },
        },
      },
    });

    return monitoringPoints;
  }

  async findAllPaginated(query: QueryDto, userId: number) {
    const { page = 1, sortBy = 'machine_name', sortOrder = 'asc' } = query;
    const limit = 5;
    const skip = (page - 1) * limit;
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const {
      monitoringPoints,
      _count: { monitoringPoints: totalMps, machines: totalMachines },
    } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        monitoringPoints: {
          skip,
          take: limit,
          orderBy,
          include: {
            machine: true,
            sensor: true,
          },
        },
        _count: {
          select: {
            monitoringPoints: true,
            machines: true,
          },
        },
      },
    });

    return {
      data: monitoringPoints,
      total: totalMps,
      page,
      totalPages: Math.ceil(totalMps / limit),
      totalMachines,
    };
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

  private buildOrderBy(sortBy: string, sortOrder: 'asc' | 'desc') {
    const sortByMap = {
      machine_name: { machine: { name: sortOrder } },
      machine_type: { machine: { type: sortOrder } },
      monitoring_point_name: { name: sortOrder },
      sensor_model: { sensor: { model: sortOrder } },
    };

    return sortByMap[sortBy] || { machine: { name: sortOrder } };
  }
}
