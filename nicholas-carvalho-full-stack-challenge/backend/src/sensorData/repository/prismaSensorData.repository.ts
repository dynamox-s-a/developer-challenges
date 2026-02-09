import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/client";
import { SensorDataRepo } from "./sensorData.repository";
import { CreateSensorDataDTO } from "../dto/createSensorData.dto";

@Injectable()
export class PrismaSensorDataRepo extends SensorDataRepo {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async findAllSensorData() {
        return await this.prisma.sensorData.findMany();
    }

    async countSensorData(sensorId: string) {
        return await this.prisma.sensorData.count({ where: { sensorId: sensorId ? sensorId : undefined } });
    }

    async getMetrics(sensorId: string) {
        const metrics = await this.prisma.sensorData.aggregate({ where: { sensorId }, _avg: { temp: true, vibration: true }, _min: { temp: true, vibration: true }, _max: { temp: true, vibration: true }, _count: true });
        return { sensorId, totalPoints: metrics._count, temp: { avarage: metrics._avg.temp ?? 0, min: metrics._min.temp ?? 0, max: metrics._max.temp }, vib: { avarage: metrics._avg.vibration, min: metrics._min.vibration, max: metrics._max.vibration }, take: 100 };
    }

    async findManySensorData(sensorId: string, startTime?: Date, endTime?: Date) {
        return await this.prisma.sensorData.findMany({ where: { sensorId, timestamp: { gte: startTime, lte: endTime } }, orderBy: { timestamp: "asc" } });
    }

    async findUniqueSensorData(id: string) {
        return await this.prisma.sensorData.findUnique({ where: { id } });
    }

    async createSensorData(data: CreateSensorDataDTO) {
        return await this.prisma.sensorData.create({ data: data as any });
    }

    async deleteSensorData(id: string) {
        await this.prisma.sensorData.delete({ where: { id } });
    }
}