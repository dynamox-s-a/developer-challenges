import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { MonitoringPointService } from "./monitoringPoint.service";
import { CreateMonitoringPointDTO } from "./dto/createMonitoringPoint.dto";
import { updateMonitoringPointDTO } from "./dto/updateMonitoringPoint.dto";
import { JWTGuard } from "src/auth/jwt.guard";
import { ApiQuery } from "@nestjs/swagger";

@UseGuards(JWTGuard)
@Controller("monitoring-point")
export class MonitoringPointController {
    constructor(private readonly monitoringPointService: MonitoringPointService) { }

    @Get()
    @ApiQuery({ name: "search", required: false, type: String })
    async findAllPaginatedPoints(@Query("page") page: string = "1", @Query("search") search?: string) {
        const pageNumber = Math.max(1, Number(page));
        return await this.monitoringPointService.findAllPaginatedPoints(pageNumber, search);
    }

    @Get(":id")
    async findMonitoringPointById(@Param("id") id: string) {
        return await this.monitoringPointService.findMonitoringPointById(id);
    }

    @Post()
    async createMonitoringPoint(@Body() data: CreateMonitoringPointDTO) {
        return await this.monitoringPointService.createMonitoringPoint(data);
    }

    @Put(":id")
    async updateMonitoringPoint(@Param("id") id: string, @Body() data: updateMonitoringPointDTO) {
        return await this.monitoringPointService.updateMonitoringPoint(data, id);
    }

    @Delete(":id")
    async deleteMonitoringPoint(@Param("id") id: string) {
        return await this.monitoringPointService.deleteMonitoringPoint(id);
    }
}