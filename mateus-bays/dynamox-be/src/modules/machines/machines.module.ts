import { Module } from '@nestjs/common';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { PrismaModule } from 'modules/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MachinesService],
  controllers: [MachinesController],
})
export class MachinesModule {}