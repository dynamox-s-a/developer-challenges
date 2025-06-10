import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMachineDTO } from './dto/create-machine.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { MachineQueryResponse } from './machines';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}
  
  async create(payload: CreateMachineDTO): Promise<MachineQueryResponse> {
    return await this.prisma.machine.create({
      data: payload,
      select: {
        name: true,
        user: true,
        userId: true,
        id: true,
        type: true,
      }
    });
  }

  async findAll() {
    return await this.prisma.machine.findMany();
  }

  async findOne(id: number): Promise<MachineQueryResponse> {
    try {
      return await this.prisma.machine.findUniqueOrThrow({
        where: {
          id,
        }, select: {
        id: true,
        name: true,
        user: true,
        userId: true,
        type: true,
      }
      },);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async update(id: number, updateMachineDto: UpdateMachineDto) {
    return `This action updates a #${id} machine`;
  }

  async remove(id: number): Promise<string> {
      try {
        await this.prisma.machine.delete({
          where: {
            id,
          },
        });
        return 'Machine deleted successfully';
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Machine not found');
        }
        throw error;
      }
    }
}
