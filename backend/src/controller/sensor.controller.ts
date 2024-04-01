import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Sensor as SensorModel } from '@prisma/client';
import { SensorService } from '../service/sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async getList(): Promise<SensorModel[]> {
    return this.sensorService.getSensorsList({
      
    });   
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<SensorModel> {
    return this.sensorService.getSensor({ id: Number(id) });
  }

}