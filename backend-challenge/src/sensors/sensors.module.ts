import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [SensorsController],
  providers: [SensorsService, PrismaService],
})
export class SensorsModule {}
