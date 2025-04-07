import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonitoringPointService } from './monitoring-point.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';

@Controller('monitoring-point')
export class MonitoringPointController {
  constructor(private readonly monitoringPointService: MonitoringPointService) {}

  @Post()
  create(@Body() createMonitoringPointDto: CreateMonitoringPointDto) {
    return this.monitoringPointService.create(createMonitoringPointDto);
  }

  @Get()
  findAll() {
    return this.monitoringPointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoringPointService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoringPointDto: UpdateMonitoringPointDto) {
    return this.monitoringPointService.update(+id, updateMonitoringPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitoringPointService.remove(+id);
  }
}
