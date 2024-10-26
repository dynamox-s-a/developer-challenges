import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  async create(createMachineDto: CreateMachineDto, userId: number) {
    return await this.prisma.machine.create({
      data: {
        ...createMachineDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    const machines = await this.prisma.machine.findMany({
      where: { userId },
    });

    return machines;
  }

  async findOne(machineId: number, userId: number) {
    const machine = await this.prisma.machine.findUnique({
      where: {
        id: machineId,
        userId,
      },
    });

    return machine;
  }

  async update(
    machineId: number,
    userId: number,
    updateMachineDto: UpdateMachineDto
  ) {
    try {
      return await this.prisma.machine.update({
        data: updateMachineDto,
        where: {
          id: machineId,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(machineId: number, userId: number) {
    try {
      return await this.prisma.machine.delete({
        where: {
          id: machineId,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
