import { Controller, Get, Post, Body, Param, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MonitoringPointsService } from './monitoring-points.service';
import { SensorModel } from '@source/persistence';

@Controller('monitoring-points')
@UseGuards(AuthGuard('jwt'))
export class MonitoringPointsController {
  constructor(private readonly mpService: MonitoringPointsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.mpService.findAll(
      page ? parseInt(page) : 1,
      5,
      sortBy || 'name',
      sortOrder || 'asc'
    );
  }

  @Post()
  async create(@Body() body: { name: string; machineId: number }) {
    return this.mpService.create(body);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mpService.findOne(id);
  }

  @Post(':id/sensors')
  async associateSensor(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { id: string; model: SensorModel }
  ) {
    return this.mpService.associateSensor(id, body);
  }
}
