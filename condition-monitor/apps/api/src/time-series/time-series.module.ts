import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { IngestionRepository } from './ingestion.repository';
import { IngestionService } from './ingestion.service';
import { ReadingsController } from './readings.controller';
import { TimeSeriesController } from './time-series.controller';
import { TimeSeriesRepository } from './time-series.repository';
import { TimeSeriesService } from './time-series.service';

@Module({
  controllers: [ReadingsController, ImportsController, TimeSeriesController],
  providers: [IngestionService, IngestionRepository, TimeSeriesService, TimeSeriesRepository],
})
export class TimeSeriesModule {}
