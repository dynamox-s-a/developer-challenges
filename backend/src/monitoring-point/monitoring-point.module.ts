import { Module } from '@nestjs/common';
import { MonitoringPointService } from './monitoring-point.service';
import { MonitoringPointController } from './monitoring-point.controller';

@Module({
  providers: [MonitoringPointService],
  controllers: [MonitoringPointController],
})
export class MonitoringPointModule {}
