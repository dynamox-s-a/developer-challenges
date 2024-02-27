import { Module } from '@nestjs/common';
import { JwtStrategy } from '../guard/jwt.strategy';
import { MachinesService } from './machines.service';
import { PrismaService } from '../database/PrismaService';
import { MachinesController } from './machines.controller';

@Module({
  controllers: [MachinesController],
  providers: [MachinesService, PrismaService, JwtStrategy],
})
export class MachinesModule {}
