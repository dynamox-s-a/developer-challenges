import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { JwtStrategy } from '../guard/jwt.strategy';
import { SensorsController } from './sensors.controller';
import { PrismaService } from '../database/PrismaService';

@Module({
  controllers: [SensorsController],
  providers: [SensorsService, PrismaService, JwtStrategy],
})
export class SensorsModule {}
