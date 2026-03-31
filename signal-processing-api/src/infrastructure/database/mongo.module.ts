import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSeriesSchema, TimeSeriesSchemaClass } from './schemas/time-series.schema';
import { MongoTimeSeriesRepository } from './mongo-time-series.repository';
import { TIME_SERIES_REPOSITORY } from '../../domain/repositories/time-series.repository';
import { SignalProcessingService } from '../../domain/services/signal-processing.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/signal-processing'),
    MongooseModule.forFeature([{ name: TimeSeriesSchemaClass.name, schema: TimeSeriesSchema }]),
  ],
  providers: [
    SignalProcessingService,
    {
      provide: TIME_SERIES_REPOSITORY,
      useClass: MongoTimeSeriesRepository,
    },
  ],
  exports: [TIME_SERIES_REPOSITORY, MongooseModule],
})
export class MongoModule {}
