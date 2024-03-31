import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MonitoringPointDto } from '../dto';

@Controller('monitoring_point')
export class MonitoringPointController {

  @Post()
  create(@Body() monitoringPointDto: MonitoringPointDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll() {
    return `This action returns all cats`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() monitoringPointDto: MonitoringPointDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}