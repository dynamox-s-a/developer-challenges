import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MachinesModule } from '../machines/machines.module';
import { MonitoringPointsModule } from '../monitoring-points/monitoring-points.module';
import { SensorModule } from '../sensor/sensor.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    UserModule,
    MachinesModule,
    MonitoringPointsModule,
    SensorModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
