import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Machine, Prisma } from '@prisma/client';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  private isValidMachineType(
    machineType: 'Pump' | 'Fan',
    sensorModel: string,
  ): boolean {
    const invalidCombinations: Record<string, string[]> = {
      Pump: ['TcAg', 'TcAs'],
      Fan: [],
    };
    return !invalidCombinations[machineType]?.includes(sensorModel);
  }

  async create(data: Prisma.MachineCreateInput): Promise<Machine> {
    return this.prisma.machine.create({ data });
  }

  async findAll(): Promise<Machine[]> {
    return this.prisma.machine.findMany();
  }

  async findOne(id: string): Promise<Machine | null> {
    return this.prisma.machine.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.MachineUpdateInput): Promise<Machine> {
    return this.prisma.machine.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Machine> {
    return this.prisma.machine.delete({ where: { id } });
  }
}
