import { Module } from '@nestjs/common';
import { SectorsController } from './sectors.controller';
import { SectorsRepository } from './sectors.repository';
import { SectorsService } from './sectors.service';

@Module({
  controllers: [SectorsController],
  providers: [SectorsService, SectorsRepository],
})
export class SectorsModule {}
