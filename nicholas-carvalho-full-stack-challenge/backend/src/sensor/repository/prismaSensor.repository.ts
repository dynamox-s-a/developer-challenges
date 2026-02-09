import { Injectable } from "@nestjs/common";
import { SensorRepo } from "./sensor.repository";
import { PrismaService } from "src/prisma/client";
import { CreateSensorDTO } from "../dto/createSensor.dto";
import { UpdateSensorDTO } from "../dto/updateSensor.dto";

@Injectable()
export class PrismaSensorRepo extends SensorRepo {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async findManySensors() {
        return await this.prisma.sensor.findMany();
    }

    async findUniqueSensor(id: string) {
        return await this.prisma.sensor.findUnique({ where: { id } });
    }

    async findSensorByUid(sensorUid: string) {
        return await this.prisma.sensor.findUnique({ where: { sensorUid } });
    }

    async findSensorByMonitoringPointId(monitoringPointId: string) {
        return await this.prisma.sensor.findUnique({ where: { monitoringPointId } });
    }

    async createSensor(data: CreateSensorDTO) {
        return await this.prisma.sensor.create({ data });
    }

    async updateSensor(data: UpdateSensorDTO, id: string) {
        return await this.prisma.sensor.update({ where: { id }, data });
    }

    async deleteSensor(id: string) {
        await this.prisma.sensor.delete({ where: { id } });
    }
}