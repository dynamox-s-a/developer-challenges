import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MachineModule } from './modules/machine/machine.module';



@Module({
  imports: [PrismaModule, MachineModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
