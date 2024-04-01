import { Module } from '@nestjs/common';

import { UserController } from './controller/user.controller';
import { MachineController } from './controller/machine.controller';
import { MonitoringPointController } from './controller/monitoring_point.controller';
import { MachineTypeController } from './controller/machine_type.controller';
import { SensorController } from './controller/sensor.controller';

import { UserService } from './service/user.service';
import { MachineService } from './service/machine.service';
import { MonitoringPointService } from './service/monitoring_point.service';
import { MachineTypeService } from './service/machine_type.service';
import { SensorService } from './service/sensor.service';

import { PrismaService } from './service/prisma.service';


@Module({
  imports: [],
  controllers: [UserController, MachineController, MonitoringPointController, MachineTypeController, SensorController],
  providers: [UserService, MachineService, MonitoringPointService, MachineTypeService, SensorService, PrismaService],
})
export class AppModule {}
