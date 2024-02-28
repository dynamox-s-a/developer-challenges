import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SensorsModule } from './sensors/sensors.module';
import { SessionsModule } from './sessions/sessions.module';
import { MachinesModule } from './machines/machines.module';
import { MonitoringPointsModule } from './monitoring-points/monitoring-points.module';

// const rootPath =
//   process.env.NODE_ENV === 'development'
//     ? join(__dirname, '../../../apps/frontend/dist/')
//     : join(__dirname, '../../../frontend/dist/');

const rootPath =
  process.env.NODE_ENV === 'development'
    ? join(__dirname, '../../../dist/apps/frontend/')
    : join(__dirname, '..', 'frontend/');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: rootPath,
      exclude: ['api/*'],
    }),
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
