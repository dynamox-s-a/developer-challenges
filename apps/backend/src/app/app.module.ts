import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const rootPath = process.env.NODE_ENV === 'development'
  ? join(__dirname, '../../../apps/frontend/dist/')
  : join(__dirname, '../../../frontend/dist/');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: rootPath,
      exclude: ['api/*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
