import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { MonitoringPointsModule } from './monitoring-points/monitoring-points.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { RealTimeModule } from './real-time/real-time.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    AuthModule,
    MachinesModule,
    MonitoringPointsModule,
    TelemetryModule,
    RealTimeModule,
    StatsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
