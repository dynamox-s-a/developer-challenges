import { Module } from '@nestjs/common';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../modules/database/prisma.module';
import { MachinesModule } from 'modules/machines/machines.module';
import { SensorsModule } from 'modules/sensors/sensors.module';
import { MonitoringPointsModule } from 'modules/monitoringPoints/monitoringPoints.module';
import { TransformResponseInterceptor } from 'interceptors/transform-response.interceptor';

@Module({
  imports: [PrismaModule, MachinesModule, MonitoringPointsModule, SensorsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    AppService],
})
export class AppModule {}
