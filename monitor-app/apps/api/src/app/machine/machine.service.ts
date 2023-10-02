import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateMachineDto } from './dto/create-machine.dto'
import { UpdateMachineDto } from './dto/update-machine.dto'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class MachineService {
  constructor(private prisma: PrismaService) {}

  async create({ name, type }: CreateMachineDto) {
    try {
      const machine = await this.prisma.machine.create({
        data: { name, type }
      })
      return machine
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Error: Machine already exists. Try another name.')
        }
      }
      throw error
    }
  }

  async findAll() {
    const machines = await this.prisma.machine.findMany()
    return machines
  }

  async findOne(id: string) {
    try {
      const machine = await this.prisma.machine.findUniqueOrThrow({
        where: {
          id: id
        }
      })
      return machine
    } catch (error) {
      throw new NotFoundException('Error: Machine not found')
    }
  }

  async update(id: string, { name, type }: UpdateMachineDto) {
    const spots = await this.prisma.spot.findMany({ where: { machineId: id } })
    spots.map((spot) => {
      if (type === 'Pump' && spot.sensorModel !== 'HF+') {
        throw new ForbiddenException(
          `Error: model ${spot.sensorModel} sensors cannot be associated with machines of type Pump`
        )
      }
    })
    try {
      const machine = await this.prisma.machine.update({
        where: {
          id: id
        },
        data: {
          name,
          type
        }
      })
      return machine
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Error: Machine already exists. Try another name.')
        }
      }
      throw error
    }
  }

  async remove(id: string) {
    await this.prisma.machine.delete({
      where: {
        id: id
      }
    })
  }
}
