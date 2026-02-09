import { Module } from '@nestjs/common';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';

@Module({
  controllers: [MonitoringPointsController],
  providers: [MonitoringPointsService],
})
export class MonitoringPointsModule {}
