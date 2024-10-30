import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthUser, User } from '../auth/user.decorator';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { MonitoringPointsService } from './monitoring-points.service';

@Controller('machines/:machineId/monitoring-points')
export class MonitoringPointsController {
  constructor(
    private readonly monitoringPointsService: MonitoringPointsService
  ) {}

  @Post()
  async create(
    @Param('machineId', ParseIntPipe) machineId: number,
    @User() user: AuthUser,
    @Body() createMonitoringPointDto: CreateMonitoringPointDto
  ) {
    return await this.monitoringPointsService.create(
      machineId,
      user.id,
      createMonitoringPointDto
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('machineId', ParseIntPipe) machineId: number,
    @Param('id', ParseIntPipe) monitoringPointId: number,
    @User() user: AuthUser
  ) {
    return await this.monitoringPointsService.remove(
      machineId,
      user.id,
      monitoringPointId
    );
  }
}
