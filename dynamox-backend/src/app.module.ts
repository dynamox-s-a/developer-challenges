import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { PrismaModule } from './prisma/prisma.module';
import { MonitoringPointModule } from './monitoring-points/monitoring-points.module';

@Module({
  imports: [AuthModule, MachinesModule, PrismaModule, MonitoringPointModule],
})
export class AppModule {}
