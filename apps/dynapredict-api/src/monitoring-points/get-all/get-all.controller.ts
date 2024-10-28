import { Controller, Get, Query } from '@nestjs/common';
import { AuthUser, User } from '../../auth/user.decorator';
import { MonitoringPointsService } from '../monitoring-points.service';
import { QueryDto } from './query.dto';

@Controller('monitoring-points')
export class GetAllController {
  constructor(
    private readonly monitoringPointsService: MonitoringPointsService
  ) {}

  @Get()
  async getMonitoringPoints(@Query() query: QueryDto, @User() user: AuthUser) {
    return await this.monitoringPointsService.findAll(query, user.id);
  }
}
