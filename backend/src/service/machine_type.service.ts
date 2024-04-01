import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Machine_Type, Prisma } from '@prisma/client';

@Injectable()
export class MachineTypeService {
  constructor(private prisma: PrismaService) {}

  async getMachineType(
    machine_typeWhereUniqueInput: Prisma.Machine_TypeWhereUniqueInput,
  ): Promise<Machine_Type | null> {
    return this.prisma.machine_Type.findUnique({
      where: machine_typeWhereUniqueInput,
    });
  }

  async getMachineTypesList(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.Machine_TypeWhereUniqueInput;
    where?: Prisma.Machine_TypeWhereInput;
    orderBy?: Prisma.Machine_TypeOrderByWithRelationInput;
  }): Promise<Machine_Type[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.machine_Type.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  
}

