import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { SensorDataService } from "./sensorData.service";
import { JWTGuard } from "src/auth/jwt.guard";
import { CreateSensorDataDTO } from "./dto/createSensorData.dto";

@UseGuards(JWTGuard)
@Controller("sensor-data")
export class SensorDataController {
    constructor(private readonly sensorDataService: SensorDataService) { }

    @Get()
    async findAllSensorData() {
        return await this.sensorDataService.findAllSensorData();
    }

    @Get("metrics/:sensorId")
    async getMetrics(@Param("sensorId") sensorId: string) {
        return await this.sensorDataService.getMetrics(sensorId);
    }

    @Get("count/:sensorId")
    async countSensorData(@Param("sensorId") sensorId: string) {
        return await this.sensorDataService.countSensorData(sensorId);
    }

    @Get(":sensorId")
    async findManySensorData(@Param("sensorId") sensorId: string, @Query("start") start?: string, @Query("end") end?: string) {
        const startDate = start ? new Date(start) : undefined;
        const endDate = end ? new Date(end) : undefined;
        return await this.sensorDataService.findManySensorData(sensorId, startDate, endDate);
    }

    @Post()
    async createSensorData(@Body() data: CreateSensorDataDTO) {
        return await this.sensorDataService.createSensorData(data);
    }

    @Delete(":id")
    async deleteSensorData(@Param("id") id: string) {
        return await this.sensorDataService.deleteSensorData(id);
    }
}