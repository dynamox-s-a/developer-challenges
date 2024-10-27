import { Injectable } from '@nestjs/common';
import { Machine } from '@prisma/client';
import { PrismaService } from 'modules/database/prisma.service';
import { CreateMachineDto, UpdateMachineDto } from './dto/machines.dto';

@Injectable()
export class MachinesService {
    constructor(private readonly prisma: PrismaService) {}

    async getAll(): Promise<Machine[]> {
        return  await this.prisma.machine.findMany();
    }

    async create(machineDto: CreateMachineDto): Promise<Machine> {
        return await this.prisma.machine.create({
            data: machineDto
        });
    }

    async update(uuid: string, machine: UpdateMachineDto): Promise<Machine> {
        return await this.prisma.machine.update({
            where: { uuid },
            data: {
                 ...machine
            },
        });
    }

    async delete(uuid: string): Promise<Machine> {
        return await this.prisma.machine.delete({
            where: { uuid }
        })
    }
}