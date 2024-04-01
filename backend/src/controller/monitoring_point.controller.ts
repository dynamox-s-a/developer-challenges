import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Monitoring_Point as Monitoring_PointModel } from '@prisma/client';
import { MonitoringPointService } from '../service/monitoring_point.service';

@Controller('monitoring_point')
export class MonitoringPointController {
  constructor(private readonly monitoringPointService: MonitoringPointService) {}

  @Post()
  async create(@Body() reqData: { name: string; machineId: number; sensorId: number; }): Promise<Monitoring_PointModel> {
    const { name, machineId, sensorId } = reqData;
    return this.monitoringPointService.createMonitoringPoint({
      name,
      machineId,
      sensorId
    });
  }

  @Get()
  async getList(): Promise<Monitoring_PointModel[]> {
    return this.monitoringPointService.getMonitoringPointsList({
      
    });   
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Monitoring_PointModel> {
    return this.monitoringPointService.getMonitoringPoint({ id: Number(id) });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() reqData: { name: string; sensorId: number; }): Promise<Monitoring_PointModel> {
    const { name, sensorId } = reqData;
    return this.monitoringPointService.updateMonitoringPoint({
      where: { id: Number(id) },
      data: {
        name,
        sensorId
      }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Monitoring_PointModel> {
    return this.monitoringPointService.deleteMonitoringPoint({ id: Number(id) });
  }
}