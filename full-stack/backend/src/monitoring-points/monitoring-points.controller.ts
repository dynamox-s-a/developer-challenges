import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MonitoringPointsService } from './monitoring-points.service';
import { CreateMonitoringPointsDto } from './dto/create-monitoring-points.dto';
import { AssociateSensorDto } from './dto/associate-sensor.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('monitoring-points')
export class MonitoringPointsController {
  constructor(
    private readonly monitoringPointsService: MonitoringPointsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createMonitoringPointsDto: CreateMonitoringPointsDto) {
    return this.monitoringPointsService.createMonitoringPoint(
      createMonitoringPointsDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':id/associate-sensor')
  async associateSensor(
    @Param('id') id: string,
    @Body() associateSensorDto: AssociateSensorDto,
  ) {
    console.log(id);
    console.log(associateSensorDto);

    return this.monitoringPointsService.associateSensor(id, associateSensorDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getMonitoringPoints(@Query('page') page: number = 2) {
    return this.monitoringPointsService.getMonitoringPoints(page);
  }
}
