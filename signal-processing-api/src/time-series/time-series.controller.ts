import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StoreTimeSeriesDto } from '../application/dtos/store-time-series.dto';
import { StoreTimeSeriesUseCase } from '../application/use-cases/store-time-series.use-case';
import { GetMetricsUseCase } from '../application/use-cases/get-metrics.use-case';
import { CountTimeSeriesUseCase, DeleteTimeSeriesUseCase, GetTimeSeriesUseCase } from '../application/use-cases/crud-use-cases.use-case';
import { KafkaProducerService } from '../infrastructure/messaging/kafka-producer.service';
import { MetricsResponseDto } from '../application/dtos/metrics-response.dto';
import { TimeSeriesResponseDto } from '../application/dtos/time-series-response.dto';

@ApiTags('time-series')
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
  @ApiOperation({ summary: 'Store a new time series and publish to Kafka' })
  @ApiResponse({ status: 201, description: 'Series stored successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async storeSeries(@Body() dto: StoreTimeSeriesDto) {
    const id = await this.storeUseCase.execute(dto);
    await this.kafkaProducer.publishRawSignal(dto);
    return { success: true, id };
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total count of unique stored sensors' })
  @ApiResponse({ status: 200, description: 'Return total count.' })
  @HttpCode(HttpStatus.OK)
  async countSeries() {
    return this.countUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full time series data for a sensor' })
  @ApiParam({ name: 'id', description: 'Sensor ID' })
  @ApiResponse({ status: 200, type: TimeSeriesResponseDto })
  @ApiResponse({ status: 404, description: 'Sensor not found.' })
  @HttpCode(HttpStatus.OK)
  async getSeries(@Param('id') id: string) {
    return this.getUseCase.execute(id);
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Calculate signal metrics (RMS, Max, etc.) for a sensor' })
  @ApiParam({ name: 'id', description: 'Sensor ID' })
  @ApiResponse({ status: 200, type: [MetricsResponseDto] })
  @ApiResponse({ status: 404, description: 'Sensor not found.' })
  @HttpCode(HttpStatus.OK)
  async getMetrics(@Param('id') id: string) {
    return this.getMetricsUseCase.execute(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete all time series data for a sensor' })
  @ApiParam({ name: 'id', description: 'Sensor ID' })
  @ApiResponse({ status: 204, description: 'Data deleted successfully.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeries(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
  }
}
