import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
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

  findOne(id: number) {
    return this.prisma.machine.findUnique({
      where: { id },
      include: {
        monitoringPoints: true,
      },
    });
  }

  async update(id: number, updateMachineDto: UpdateMachineDto) {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
    });

    if (!machine) {
      throw new NotFoundException(`Machine with Id ${id} not found`);
    }

    if (updateMachineDto.name) {
      const machineWithSameName = await this.prisma.machine.findFirst({
        where: {
          name: updateMachineDto.name,
          NOT: {
            id,
          },
        },
      });

      if (machineWithSameName) {
        throw new ConflictException('Machine with this name already exists');
      }
    }

    return this.prisma.machine.update({
      where: { id },
      data: updateMachineDto,
    });
  }

  async remove(id: number) {
    const monitoringPointsCount = await this.prisma.monitoringPoint.count({
      where: {
        machineId: id,
      },
    });

    if (monitoringPointsCount > 0) {
      throw new ConflictException('This Machine have monitoring Point associated!');
    }

    const machine = await this.prisma.machine.findUnique({
      where: { id },
    });

    if (!machine) {
      throw new ConflictException(`This Machine with Id ${id} don't exists!`);
    }

    return this.prisma.machine.delete({
      where: { id },
    });
  }
}