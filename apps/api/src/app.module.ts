import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AlertsModule } from './alerts/alerts.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { MachinesModule } from './machines/machines.module';
import { MonitoringPointsModule } from './monitoring-points/monitoring-points.module';
import { PrismaModule } from './prisma/prisma.module';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), '.env'), join(process.cwd(), '..', '..', '.env')],
    }),
    PrismaModule,
    AlertsModule,
    AnalyticsModule,
    AuthModule,
    HealthModule,
    MachinesModule,
    MonitoringPointsModule,
    TelemetryModule,
  ],
})
export class AppModule {}
