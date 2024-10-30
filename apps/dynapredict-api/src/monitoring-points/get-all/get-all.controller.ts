import { Controller, Get, Query } from '@nestjs/common';
import { AuthUser, User } from '../../auth/user.decorator';
import { MonitoringPointsService } from '../monitoring-points.service';
import { QueryDto } from './query.dto';

@Controller()
export class GetAllController {
  constructor(
    private readonly monitoringPointsService: MonitoringPointsService
  ) {}

  @Get('/monitoring-points')
  async getMonitoringPoints(@User() user: AuthUser) {
    return await this.monitoringPointsService.findAll(user.id);
  }

  @Get('/monitoring-points/paginated')
  async getPaginatedMonitoringPoints(
    @Query() query: QueryDto,
    @User() user: AuthUser
  ) {
    return await this.monitoringPointsService.findAllPaginated(query, user.id);
  }
}
