import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { MonitoringPoint } from "@prisma/client";
import { MonitoringPointsService } from "./monitoringPoints.service";
import { CreateMonitoringPointDto, UpdateMonitoringPointDto } from "./dto/monitoringPoints.dto";

@Controller('monitoring-points')
export class MonitoringPointsController {
    constructor(
        private readonly monitoringPointsService: MonitoringPointsService,
    ) { }


    @Get()
    async getAll(): Promise<MonitoringPoint[]> {
        return this.monitoringPointsService.getAll();
    }

    @Post()
    async create(@Body() monitoringPointDto: CreateMonitoringPointDto): Promise<MonitoringPoint> {
        return this.monitoringPointsService.create(monitoringPointDto)
    }


    @Patch(':uuid')
    async update(
        @Param('uuid') uuid: string,
        @Body() monitoringPointDto: UpdateMonitoringPointDto
    ): Promise<MonitoringPoint> {
        return this.monitoringPointsService.update(uuid, monitoringPointDto);
    }

    @Delete(':uuid')
    async delete(@Param('uuid') uuid: string): Promise<MonitoringPoint> {
        return this.monitoringPointsService.delete(uuid);
    }
}