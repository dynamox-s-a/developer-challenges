import { Module } from '@nestjs/common';
import { OverviewController } from './overview.controller';
import { OverviewRepository } from './overview.repository';

@Module({
  controllers: [OverviewController],
  providers: [OverviewRepository],
})
export class OverviewModule {}
