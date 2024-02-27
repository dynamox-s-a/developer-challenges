import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SensorsModule } from './sensors/sensors.module';
import { SessionsModule } from './sessions/sessions.module';

const rootPath =
  process.env.NODE_ENV === 'development'
    ? join(__dirname, '../../../apps/frontend/dist/')
    : join(__dirname, '../../../frontend/dist/');

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
