import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMachineDto, UpdateMachineDto } from './dto';

@Injectable()
export class MachineService {
  constructor(private prisma: PrismaService) {}

  async createMachine(data: CreateMachineDto) {
    return this.prisma.machine.create({
      data,
    });
  }

  async updateMachine(id: number, data: UpdateMachineDto) {
    const existing = await this.prisma.machine.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Machine not found');

    return this.prisma.machine.update({
      where: { id },
      data,
    });
  }

  async deleteMachine(id: number) {
    const existing = await this.prisma.machine.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Machine not found');

    await this.prisma.monitoringPoint.deleteMany({
      where: { machineId: id },
    });

    return this.prisma.machine.delete({
      where: { id },
    });
  }

  async getMachines() {
    return this.prisma.machine.findMany({
      include: {
        points: true,
      },
    });
  }

  async getMachineById(id: number) {
    const existing = await this.prisma.machine.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Machine not found');
    return this.prisma.machine.findUnique({
      where: { id },
      include: {
        points: true,
      },
    });
  }
}
