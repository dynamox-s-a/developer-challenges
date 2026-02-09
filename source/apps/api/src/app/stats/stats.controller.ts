import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(AuthGuard('jwt'))
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('telemetry')
  async getTotalTelemetry() {
    return this.statsService.getTotalTelemetry();
  }

  @Get('machines')
  async getMachinesCount() {
    return this.statsService.getMachinesCount();
  }

  @Get('monitoring-points')
  async getMonitoringPointsCount() {
    return this.statsService.getMonitoringPointsCount();
  }

  @Get('active-sensors')
  async getActiveSensorsCount() {
    return this.statsService.getActiveSensorsCount();
  }

  @Get('dashboard')
  async getDashboardStats() {
    return this.statsService.getDashboardStats();
  }
}
