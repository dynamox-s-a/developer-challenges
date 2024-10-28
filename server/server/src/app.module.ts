import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { PrismaAuthRepository } from './repositories/prisma/prisma.auth.repository';
import { JwtService } from '@nestjs/jwt';
import AuthControler from './controllers/AuthController/auth.controller';
import { PrismaMachineRepository } from './repositories/prisma/prisma.machine.repository';
import MachineController from './controllers/MachineController/machine.controller';
import MonitoringPointsController from './controllers/MonitoringPointsController/monitoring.points.controller';
import { PrismaMonitoringPointsRepository } from './repositories/prisma/prisma.monitoring.points';

@Module({
  imports: [],
  controllers: [AuthControler, MachineController, MonitoringPointsController],
  providers: [
    PrismaService,
    PrismaAuthRepository,
    PrismaMachineRepository,
    PrismaMonitoringPointsRepository,
    JwtService,
  ],
})
export class AppModule {}
