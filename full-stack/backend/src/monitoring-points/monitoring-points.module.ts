import { Module } from '@nestjs/common';
import { MonitoringPointsService } from './monitoring-points.service';
import { MonitoringPointsController } from './monitoring-points.controller';

@Module({
  controllers: [MonitoringPointsController],
  providers: [MonitoringPointsService],
})
export class MonitoringPointsModule {}
