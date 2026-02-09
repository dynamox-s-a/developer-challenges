import { Module } from '@nestjs/common';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MonitoringPointsService } from './monitoring-points.service';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [StatsModule],
  controllers: [MonitoringPointsController],
  providers: [MonitoringPointsService],
})
export class MonitoringPointsModule {}
