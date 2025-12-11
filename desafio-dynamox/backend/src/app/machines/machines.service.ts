import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import {CreateMachineDto} from "./dto/create-machine.dto";

type UpadateMachineDto = Partial<CreateMachineDto>;

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  create(CreateMachineDto: CreateMachineDto) {
    return this.prisma.machine.create({ 
      data: {
        name: CreateMachineDto.name,
        type: CreateMachineDto.type,
      }
     });
  }

  findAll() {
    return this.prisma.machine.findMany({
      include: { monitoringPoints: true }
    });
  }

  findOne(id: string) {
    return this.prisma.machine.findUnique({
      where: { id },
      include: { monitoringPoints: true }
    });
  }

  update(id: string, UpadateMachineDto: Prisma.MachineUpdateInput) {
    return this.prisma.machine.update({
      where: { id },
      data: UpadateMachineDto,
    });
  }

  remove(id: string) {
    return this.prisma.machine.delete({ where: { id } });
  }
}