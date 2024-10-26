import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthUser, User } from '../auth/user.decorator';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { MonitoringPointsService } from './monitoring-points.service';

@Controller('monitoring-points')
export class MonitoringPointsController {
  constructor(
    private readonly monitoringPointsService: MonitoringPointsService
  ) {}

  @Post()
  async create(
    @Body() createMonitoringPointDto: CreateMonitoringPointDto,
    @User() user: AuthUser
  ) {
    return await this.monitoringPointsService.create(
      createMonitoringPointDto,
      user.id
    );
  }

  @Get()
  async findAll(@User() user: AuthUser) {
    return await this.monitoringPointsService.findAll(user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) monitoringPointId: number,
    @User() user: AuthUser
  ) {
    return await this.monitoringPointsService.remove(
      monitoringPointId,
      user.id
    );
  }
}
