import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Machine, Prisma } from '@prisma/client';

@Injectable()
export class MachineService {
  constructor(private prisma: PrismaService) {}

  async getMachine(
    machineWhereUniqueInput: Prisma.MachineWhereUniqueInput,
  ): Promise<Machine | null> {
    return this.prisma.machine.findUnique({
      where: machineWhereUniqueInput,
    });
  }

  async getMachinesList(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MachineWhereUniqueInput;
    where?: Prisma.MachineWhereInput;
    orderBy?: Prisma.MachineOrderByWithRelationInput;
  }): Promise<Machine[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.machine.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createMachine(data: Prisma.MachineUncheckedCreateInput): Promise<Machine> {
    return this.prisma.machine.create({
      data,
    });
  }

  async updateMachine(params: {
    where: Prisma.MachineWhereUniqueInput;
    data: Prisma.MachineUncheckedUpdateInput;
  }): Promise<Machine> {
    const { where, data } = params;
    return this.prisma.machine.update({
      data,
      where,
    });
  }

  async deleteMachine(where: Prisma.MachineWhereUniqueInput): Promise<Machine> {
    return this.prisma.machine.delete({
      where,
    });
  }
  
}

