import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Sensor, Prisma } from '@prisma/client';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  async getSensor(
    sensorWhereUniqueInput: Prisma.SensorWhereUniqueInput,
  ): Promise<Sensor | null> {
    return this.prisma.sensor.findUnique({
      where: sensorWhereUniqueInput,
    });
  }

  async getSensorsList(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SensorWhereUniqueInput;
    where?: Prisma.SensorWhereInput;
    orderBy?: Prisma.SensorOrderByWithRelationInput;
  }): Promise<Sensor[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.sensor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  
}

