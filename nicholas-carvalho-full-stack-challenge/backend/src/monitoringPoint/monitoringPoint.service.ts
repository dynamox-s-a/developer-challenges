import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { MonitoringPointRepo } from "./repository/monitoringPoint.repository";
import { CreateMonitoringPointDTO } from "./dto/createMonitoringPoint.dto";
import { updateMonitoringPointDTO } from "./dto/updateMonitoringPoint.dto";
import { MachineRepo } from "src/machine/repository/machine.repository";

@Injectable()
export class MonitoringPointService {
    constructor(@Inject("MonitoringPointRepo") private readonly monitoringPointRepo: MonitoringPointRepo, @Inject("MachineRepo") private readonly machineRepo: MachineRepo) { }

    async findAllPaginatedPoints(page: number, search?: string) {
        return await this.monitoringPointRepo.findAllPaginatedPoints(page, search);
    }

    async findMonitoringPointById(id: string) {
        const monitoringPoint = await this.monitoringPointRepo.findMonitoringPointById(id);
        if (monitoringPoint) {
            return monitoringPoint;
        }
        throw new NotFoundException(`Monitoring Point with id ${id} does not exists!`);
    }

    async createMonitoringPoint(data: CreateMonitoringPointDTO) {
        const machineExists = await this.machineRepo.findUniqueMachine(data.machineId);
        if (!machineExists) {
            throw new NotFoundException(`Machine with id ${data.machineId} does not exists!`);
        }
        return await this.monitoringPointRepo.createMonitoringPoint(data);
    }

    async updateMonitoringPoint(data: updateMonitoringPointDTO, id: string) {
        const monitoringPointExists = await this.monitoringPointRepo.findMonitoringPointById(id);
        if (monitoringPointExists) {
            return await this.monitoringPointRepo.updateMonitoringPoint(data, id);
        }
        const machineExists = await this.machineRepo.findUniqueMachine(data.machineId);
        if (!machineExists) {
            throw new NotFoundException(`Machine with id ${data.machineId} does not exists!`);
        }
        throw new NotFoundException(`Monitoring Point with id ${id} does not exists!`);
    }

    async deleteMonitoringPoint(id: string) {
        const monitoringPointExists = await this.monitoringPointRepo.findMonitoringPointById(id);
        if (monitoringPointExists) {
            await this.monitoringPointRepo.deleteMonitoringPoint(id);
            return { message: "Monitoring Point has been deleted sucessfully!", statusCode: 200 }
        }
        throw new NotFoundException(`Monitoring Point with id ${id} does not exists!`);
    }
}