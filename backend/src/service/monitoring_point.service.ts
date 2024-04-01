import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Monitoring_Point, Prisma } from '@prisma/client';

@Injectable()
export class MonitoringPointService {
  constructor(private prisma: PrismaService) {}

  async getMonitoringPoint(
    monitoringPointWhereUniqueInput: Prisma.Monitoring_PointWhereUniqueInput,
  ): Promise<Monitoring_Point | null> {
    return this.prisma.monitoring_Point.findUnique({
      where: monitoringPointWhereUniqueInput,
    });
  }

  async getMonitoringPointsList(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.Monitoring_PointWhereUniqueInput;
    where?: Prisma.Monitoring_PointWhereInput;
    orderBy?: Prisma.Monitoring_PointOrderByWithRelationInput;
  }): Promise<Monitoring_Point[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.monitoring_Point.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createMonitoringPoint(data: Prisma.Monitoring_PointUncheckedCreateInput): Promise<Monitoring_Point> {
    return this.prisma.monitoring_Point.create({
      data,
    });
  }

  async updateMonitoringPoint(params: {
    where: Prisma.Monitoring_PointWhereUniqueInput;
    data: Prisma.Monitoring_PointUncheckedUpdateInput;
  }): Promise<Monitoring_Point> {
    const { where, data } = params;
    return this.prisma.monitoring_Point.update({
      data,
      where,
    });
  }

  async deleteMonitoringPoint(where: Prisma.Monitoring_PointWhereUniqueInput): Promise<Monitoring_Point> {
    return this.prisma.monitoring_Point.delete({
      where,
    });
  }
  
}

