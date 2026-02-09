import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/client";
import { MachineRepo } from "./machine.repository";
import { CreateMachineDTO } from "../dto/createMachine.dto";
import { UpdateMachineDTO } from "../dto/updateMachine.dto";

@Injectable()
export class PrismaMachineRepo extends MachineRepo {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async findManyByUser(userId: string) {
        return await this.prisma.machine.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    }

    async findManyMachines() {
        return await this.prisma.machine.findMany({ orderBy: { createdAt: "desc" } });
    }

    async findUniqueMachine(id: string) {
        return await this.prisma.machine.findUnique({ where: { id } });
    }

    async findMachineByName(name: string) {
        return await this.prisma.machine.findUnique({ where: { name } });
    }

    async createMachine(data: CreateMachineDTO) {
        return await this.prisma.machine.create({ data });
    }

    async updateMachine(data: UpdateMachineDTO, id: string) {
        return await this.prisma.machine.update({ where: { id }, data });
    }

    async deleteMachine(id: string) {
        await this.prisma.machine.delete({ where: { id } });
    }
}