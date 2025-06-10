import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { MachinesModule } from '../machines/machines.module';

@Module({
  controllers: [AppController],
  imports: [UsersModule, MachinesModule],
  providers: [AppService],
})
export class AppModule {}
