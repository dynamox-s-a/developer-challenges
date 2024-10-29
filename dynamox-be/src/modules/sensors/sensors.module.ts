import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { PrismaModule } from 'modules/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SensorsService],
  controllers: [SensorsController],
})
export class SensorsModule {}