import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'

import { CreateMachineDto } from './dto/create-machine.dto'
import { UpdateMachineDto } from './dto/update-machine.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Machine } from './entity/machine.entity'
@Injectable()
export class MachineService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createMachineDto: CreateMachineDto): Promise<Machine> {
        const data: Prisma.MachineCreateInput = {
            ...createMachineDto,
        }

        const createdMachine = await this.prisma.machine.create({ data })

        return {
            ...createdMachine,
        }
    }

    findByMachineId(id: number) {
        return this.prisma.machine.findUnique({
            where: { machine_id: id},
        })
    }

    findByUserId(id: number) {
        return this.prisma.machine.findMany({
            where: { user_id: id },
        })
    }


    findAll() {
        return this.prisma.machine.findMany()
    }

    update(id: number, updateMachineDto: UpdateMachineDto) {
        const data: Prisma.MachineUpdateInput = {
            ...updateMachineDto,
        }

        return this.prisma.machine.update({
            where: { machine_id: id },
            data,
        })
    }

    remove(id: number) {
        return this.prisma.machine.delete({
            where: { machine_id: id },
        })
    }
}
