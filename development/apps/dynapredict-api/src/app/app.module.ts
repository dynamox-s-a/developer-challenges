import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AppController],
  imports: [UsersModule],
  providers: [AppService],
})
export class AppModule {}
