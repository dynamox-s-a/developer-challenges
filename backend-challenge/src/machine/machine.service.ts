import { Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'node:crypto'

@Injectable()
export class MachineService {
  constructor(private prisma: PrismaService) {}

  async create(createMachineDto: CreateMachineDto, req: any) {
    const { name, type } = createMachineDto;
    const machine = await this.prisma.machine.create({
      data: {
        idMachine: randomUUID(),
        name,
        type,
        userId: req.sub.sub
      }
    })
    return {
      machine,
    };
  }

  async findAll() {
    return await this.prisma.machine.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.machine.findUnique({
      where: { idMachine: id }
    })
  }

  async update(id: string, updateMachineDto: UpdateMachineDto) {
    return await this.prisma.machine.update({
      where: { idMachine: id },
      data: updateMachineDto
    })
  }

  async remove(id: string) {
    return await this.prisma.machine.delete({
      where: { idMachine: id }
    })
  }
}
