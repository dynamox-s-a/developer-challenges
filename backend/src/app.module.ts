import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MachinesModule } from './machines/machines.module';
import { PrismaService } from './prisma/prisma.service'; // Import PrismaService

@Module({
  imports: [MachinesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
