import { Module } from '@nestjs/common';
import { MonitoringPointService } from './monitoring-point.service';
import { MonitoringPointController } from './monitoring-point.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MonitoringPointController],
  providers: [MonitoringPointService],
})
export class MonitoringPointModule {}
