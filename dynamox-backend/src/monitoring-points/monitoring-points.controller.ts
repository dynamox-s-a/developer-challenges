import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MonitoringPointService } from './monitoring-points.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';

@Controller('monitoring-points')
export class MonitoringPointController {
  constructor(
    private readonly monitoringPointService: MonitoringPointService,
  ) {}

  @Post()
  create(@Body() createMonitoringPointDto: CreateMonitoringPointDto) {
    return this.monitoringPointService.create(createMonitoringPointDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('sortBy') sortBy = 'name',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.monitoringPointService.findAll(+page, +limit, sortBy, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoringPointService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMonitoringPointDto: UpdateMonitoringPointDto,
  ) {
    return this.monitoringPointService.update(+id, updateMonitoringPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitoringPointService.remove(+id);
  }
}
