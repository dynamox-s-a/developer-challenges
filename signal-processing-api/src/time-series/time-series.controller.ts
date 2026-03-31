import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { StoreTimeSeriesDto } from '../application/dtos/store-time-series.dto';
import { StoreTimeSeriesUseCase } from '../application/use-cases/store-time-series.use-case';
import { GetMetricsUseCase } from '../application/use-cases/get-metrics.use-case';
import { CountTimeSeriesUseCase, DeleteTimeSeriesUseCase, GetTimeSeriesUseCase } from '../application/use-cases/crud-use-cases.use-case';
import { KafkaProducerService } from '../infrastructure/messaging/kafka-producer.service';

@Controller('api/time-series')
export class TimeSeriesController {
  constructor(
    private readonly storeUseCase: StoreTimeSeriesUseCase,
    private readonly getMetricsUseCase: GetMetricsUseCase,
    private readonly countUseCase: CountTimeSeriesUseCase,
    private readonly deleteUseCase: DeleteTimeSeriesUseCase,
    private readonly getUseCase: GetTimeSeriesUseCase,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async storeSeries(@Body() dto: StoreTimeSeriesDto) {
    const id = await this.storeUseCase.execute(dto);
    
    // As per assignment, emit via Kafka
    await this.kafkaProducer.publishRawSignal(dto);

    return { success: true, id };
  }

  @Get('count')
  @HttpCode(HttpStatus.OK)
  async countSeries() {
    return this.countUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSeries(@Param('id') id: string) {
    return this.getUseCase.execute(id);
  }

  @Get(':id/metrics')
  @HttpCode(HttpStatus.OK)
  async getMetrics(@Param('id') id: string) {
    return this.getMetricsUseCase.execute(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeries(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
  }
}
