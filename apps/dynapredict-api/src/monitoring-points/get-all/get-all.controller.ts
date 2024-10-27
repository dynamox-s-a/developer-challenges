import { Controller, Get } from '@nestjs/common';
import { AuthUser, User } from '../../auth/user.decorator';
import { MonitoringPointsService } from '../monitoring-points.service';

@Controller('monitoring-points')
export class GetAllController {
  constructor(
    private readonly monitoringPointsService: MonitoringPointsService
  ) {}

  @Get()
  async findAll(@User() user: AuthUser) {
    return await this.monitoringPointsService.findAll(user.id);
  }
}
