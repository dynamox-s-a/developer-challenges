import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SensorsModule } from './sensors/sensors.module';
import { SessionsModule } from './sessions/sessions.module';
import { MachinesModule } from './machines/machines.module';
import { MonitoringPointsModule } from './monitoring-points/monitoring-points.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    SessionsModule,
    SensorsModule,
    MachinesModule,
    MonitoringPointsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
