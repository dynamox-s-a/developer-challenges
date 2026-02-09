import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { SensorService } from "./sensor.service";
import { CreateSensorDTO } from "./dto/createSensor.dto";
import { UpdateSensorDTO } from "./dto/updateSensor.dto";
import { JWTGuard } from "src/auth/jwt.guard";

@UseGuards(JWTGuard)
@Controller("sensor")
export class SensorController {
    constructor(private readonly sensorService: SensorService) { }

    @Get()
    async findManySensors() {
        return await this.sensorService.findManySensors();
    }

    @Get(":id")
    async findUniqueSensor(@Param("id") id: string) {
        return await this.sensorService.findUniqueSensor(id);
    }

    @Post()
    async createSensor(@Body() data: CreateSensorDTO) {
        return await this.sensorService.createSensor(data);
    }

    @Put(":id")
    async updateSensor(@Body() data: UpdateSensorDTO, @Param("id") id: string) {
        return await this.sensorService.updateSensor(data, id);
    }

    @Delete(":id")
    async deleteSensor(@Param("id") id: string) {
        return await this.sensorService.deleteSensor(id);
    }
}