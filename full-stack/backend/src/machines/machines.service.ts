import { Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MachinesService {
  constructor(private readonly prisma: PrismaService) {}

  fillAll() {
    return this.prisma.machine.findMany();
  }

  async findOne(id: string) {
    return this.prisma.machine.findUnique({
      where: { id },
    });
  }

  async create(createMachineDto: CreateMachineDto) {
    return await this.prisma.machine.create({
      data: createMachineDto,
    });
  }

  update(id: string, updateMachineDto: UpdateMachineDto) {
    return this.prisma.machine.update({
      where: {
        id,
      },
      data: updateMachineDto,
    });
  }

  async remove(id: string) {
    await this.prisma.machine.delete({
      where: {
        id,
      },
    });
  }
}
