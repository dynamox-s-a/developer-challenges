import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachineService {
  constructor(private prisma: PrismaService) { }

  async create(createMachineDto: CreateMachineDto) {
    const machine = await this.prisma.machine.findFirst({
      where: {
        name: createMachineDto.name,
      }
    });

    if (machine) {
      throw new ConflictException('Machine with this name already exists');
    }

    return this.prisma.machine.create({
      data: createMachineDto,
    });
  }

  findAll() {
    return this.prisma.machine.findMany();
  }

  findOne(id: string) {
    return this.prisma.machine.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateMachineDto: UpdateMachineDto) {
    if (updateMachineDto.name) {
      const machine = await this.prisma.machine.findFirst({
        where: {
          name: updateMachineDto.name,
          NOT: {
            id,
          },
        },
      });

      if (machine) {
        throw new ConflictException('Machine with this name already exists');
      }
    }

    return this.prisma.machine.update({
      where: { id },
      data: updateMachineDto,
    });
  }

  remove(id: string) {
    return this.prisma.machine.delete({
      where: { id },
    });
  }
}