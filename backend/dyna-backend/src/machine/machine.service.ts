import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMachinesDto } from './dto/machine';
import { StatusMachine } from '@prisma/client';

@Injectable()
export class MachineService {
  constructor(private prismaService: PrismaService) { }

  async create(data: CreateMachinesDto) {

    const { name, typeOfMachine, statusMachine, pointmonitoring1, pointmonitoring2 } = data


    const machine = await this.prismaService.machine.create({
      data: {
        name,
        typeOfMachine,
        statusMachine: statusMachine as StatusMachine,
        pointmonitoring1: pointmonitoring1 ? { connect: { id: pointmonitoring1 } } : undefined,
        pointmonitoring2: pointmonitoring2 ? { connect: { id: pointmonitoring2 } } : undefined,

      }

    });


    return { message: "Registro criado com sucesso", machine };

  }

  async delete(id: number) {
    const deletedMachine = await this.prismaService.machine.delete({
      where: {
        id: id
      }
    })

    return { message: "Registro deletado com sucesso", deletedMachine };
  }
}
