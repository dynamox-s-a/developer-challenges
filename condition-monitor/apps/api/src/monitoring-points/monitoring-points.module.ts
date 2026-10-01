import { Module } from '@nestjs/common';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsRepository } from './monitoring-points.repository';
import { MonitoringPointsService } from './monitoring-points.service';

@Module({
  controllers: [MonitoringPointsController],
  providers: [MonitoringPointsService, MonitoringPointsRepository],
  exports: [MonitoringPointsRepository],
})
export class MonitoringPointsModule {}
