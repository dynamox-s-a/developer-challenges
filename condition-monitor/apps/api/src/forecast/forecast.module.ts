import { Module } from '@nestjs/common';
import { ForecastController } from './forecast.controller';
import { ForecastRepository } from './forecast.repository';
import { ForecastService } from './forecast.service';

@Module({
  controllers: [ForecastController],
  providers: [ForecastService, ForecastRepository],
})
export class ForecastModule {}
