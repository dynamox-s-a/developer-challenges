import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { MachineModule } from './machine/machine.module';


@Module({
  imports: [AuthModule, MachineModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
