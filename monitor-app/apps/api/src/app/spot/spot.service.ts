import { ForbiddenException, Injectable } from '@nestjs/common'
import { CreateSpotDto } from './dto/create-spot.dto'
import { UpdateSpotDto } from './dto/update-spot.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { MachineService } from '../machine/machine.service'

@Injectable()
export class SpotService {
  constructor(private prisma: PrismaService, private readonly machineService: MachineService) {}

  async create({ name, machineId, sensorId, sensorModel }: CreateSpotDto) {
    const machine = await this.machineService.findOne(machineId)
    if (machine.type === 'Pump' && sensorModel !== 'HF+') {
      throw new ForbiddenException(
        `Error: model ${sensorModel} sensors cannot be associated with machines of type Pump`
      )
    }
    try {
      const spot = await this.prisma.spot.create({
        data: { name, machineId, sensorId, sensorModel }
      })
      return spot
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const { target } = error.meta
          if (target[0] === 'name') {
            throw new ForbiddenException('Error: Spot already exists. Try another name.')
          }
          throw new ForbiddenException('Error: Sensor is already being used. Try another ID.')
        }
      }
      throw error
    }
  }

  async findAll() {
    const spot = await this.prisma.spot.findMany()
    return spot
  }

  async findOne(id: string) {
    const spot = await this.prisma.spot.findFirst({ where: { id: id } })
    return spot
  }

  async update(id: string, { name, machineId, sensorId, sensorModel }: UpdateSpotDto) {
    const machine = await this.machineService.findOne(machineId)
    if (machine.type === 'Pump' && sensorModel !== 'HF+') {
      throw new ForbiddenException(
        `Error: model ${sensorModel} sensors cannot be associated with machines of type Pump`
      )
    }
    try {
      const spot = await this.prisma.spot.update({
        where: { id: id },
        data: { name, machineId, sensorId, sensorModel }
      })
      return spot
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const { target } = error.meta
          if (target[0] === 'name') {
            throw new ForbiddenException('Error: Spot already exists. Try another name.')
          }
          throw new ForbiddenException('Error: Sensor is already being used. Try another ID.')
        }
      }
      throw error
    }
  }

  async remove(id: string) {
    await this.prisma.spot.delete({ where: { id: id } })
  }
}
