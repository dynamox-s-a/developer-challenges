import { Module } from '@nestjs/common';
import { TimeSeriesController } from './time-series.controller';
import { StoreTimeSeriesUseCase } from '../application/use-cases/store-time-series.use-case';
import { GetMetricsUseCase } from '../application/use-cases/get-metrics.use-case';
import { DeleteTimeSeriesUseCase, CountTimeSeriesUseCase, GetTimeSeriesUseCase } from '../application/use-cases/crud-use-cases.use-case';
import { MongoModule } from '../infrastructure/database/mongo.module';
import { KafkaModule } from '../infrastructure/messaging/kafka.module';

@Module({
  imports: [MongoModule, KafkaModule],
  controllers: [TimeSeriesController],
  providers: [
    StoreTimeSeriesUseCase,
    GetMetricsUseCase,
    DeleteTimeSeriesUseCase,
    CountTimeSeriesUseCase,
    GetTimeSeriesUseCase
  ]
})
export class TimeSeriesModule {}
