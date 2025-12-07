import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { MachinesModule } from './machines/machines.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [MachinesModule, PointsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
