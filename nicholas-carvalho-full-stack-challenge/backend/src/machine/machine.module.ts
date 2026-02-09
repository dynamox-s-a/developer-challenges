import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { PrismaService } from 'src/prisma/client';
import { PrismaMachineRepo } from './repository/prismaMachine.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MachineController],
  providers: [MachineService, PrismaService, { provide: 'MachineRepo', useClass: PrismaMachineRepo }, JwtService],
})
export class MachineModule { }
