import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { MonitoringPointService } from './monitoring-point.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('monitoring-points')
@ApiBearerAuth()
@Controller('monitoring-point')
export class MonitoringPointController {
  constructor(private readonly monitoringPointService: MonitoringPointService) {}

  @Post(':machineId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new monitoring point' })
  @ApiResponse({ status: 201, description: 'The monitoring point has been successfully created.' })
  @ApiParam({ name: 'machineId', type: String })
  create(
    @Request() req: any, 
    @Param('machineId') machineId: string,
    @Body() createMonitoringPointDto: CreateMonitoringPointDto
  ) {
    return this.monitoringPointService.create(createMonitoringPointDto, req, machineId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all monitoring points' })
  @ApiResponse({ status: 200, description: 'Return all monitoring points.' })
  findAll() {
    return this.monitoringPointService.findAll();
  }

  @Get(':id/:machineId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a monitoring point by id and machineId' })
  @ApiResponse({ status: 200, description: 'Return the monitoring point.' })
  @ApiResponse({ status: 404, description: 'Monitoring point not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Point Id' })
  @ApiParam({ name: 'machineId', type: String, description: 'Machine Id' })
  findOne(@Param('id') id: string, @Param('machineId') machineId: string) {
    return this.monitoringPointService.findOne(id, machineId);
  }

  @Patch(':id/:machineId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a monitoring point' })
  @ApiResponse({ status: 200, description: 'The monitoring point has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Monitoring point not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Point Id' })
  @ApiParam({ name: 'machineId', type: String, description: 'Machine Id' })
  update(@Param('id') id: string, @Param('machineId') machineId: string, @Body() updateMonitoringPointDto: UpdateMonitoringPointDto) {
    return this.monitoringPointService.update(id, machineId, updateMonitoringPointDto);
  }

  @Delete(':id/:machineId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a monitoring point' })
  @ApiResponse({ status: 200, description: 'The monitoring point has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Monitoring point not found.' })
  @ApiParam({ name: 'id', type: String, description: 'Point Id' })
  @ApiParam({ name: 'machineId', type: String, description: 'Machine Id' })
  remove(@Param('id') id: string, @Param('machineId') machineId: string) {
    return this.monitoringPointService.remove(id, machineId);
  }
}
