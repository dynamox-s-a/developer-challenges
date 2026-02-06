import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { MonitoringPointService } from "./monitoring-point.service";
import { UpdateMonitotingPointDto } from "./dto/update-monitoring-point.dto";
import { CreateMonitoringPointDto } from "./dto/create-monitoring-point.dto";

@Controller('monitoring-points')
export class MonitoringPointController {
  constructor(private readonly monitoringPointService: MonitoringPointService) { }

  @Post()
  create(@Body() createMonitoringPointDto: CreateMonitoringPointDto) {
    return this.monitoringPointService.create(createMonitoringPointDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.monitoringPointService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.monitoringPointService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMonitotingPointDto: UpdateMonitotingPointDto) {
    return this.monitoringPointService.update(id, updateMonitotingPointDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.monitoringPointService.remove(id);
  }
}