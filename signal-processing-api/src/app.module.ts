import { Module } from '@nestjs/common';
import { TimeSeriesModule } from './time-series/time-series.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TimeSeriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
