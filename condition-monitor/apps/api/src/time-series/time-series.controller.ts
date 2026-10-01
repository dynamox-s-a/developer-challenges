import { Controller, Delete, Get, HttpCode, Param, Query } from '@nestjs/common';
import {
  readingsQuerySchema,
  timeRangeQuerySchema,
  type ReadingsAnswer,
  type SeriesMetrics,
  type SessionUser,
  type TimeSeriesSummary,
} from '@condition-monitor/shared';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from '../auth/current-user.decorator';
import { uuidParam } from '../common/validation/uuid-param.pipe';
import { TimeSeriesService } from './time-series.service';

class TimeRangeQueryDto extends createZodDto(timeRangeQuerySchema) {}
class ReadingsQueryDto extends createZodDto(readingsQuerySchema) {}

/** Retrieving, measuring and deleting time-series (challenge, section 7). */
@Controller()
export class TimeSeriesController {
  constructor(private readonly series: TimeSeriesService) {}

  @Get('monitoring-points/:id/time-series')
  listOfPoint(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Monitoring point')) pointId: string,
  ): Promise<TimeSeriesSummary[]> {
    return this.series.listOfPoint(user.id, pointId);
  }

  @Get('time-series/:id/metrics')
  metrics(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Time-series')) seriesId: string,
    @Query() query: TimeRangeQueryDto,
  ): Promise<SeriesMetrics> {
    return this.series.metrics(user.id, seriesId, query);
  }

  @Get('time-series/:id/readings')
  readings(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Time-series')) seriesId: string,
    @Query() query: ReadingsQueryDto,
  ): Promise<ReadingsAnswer> {
    return this.series.readings(user.id, seriesId, query);
  }

  @Delete('time-series/:id')
  @HttpCode(204)
  delete(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Time-series')) seriesId: string,
  ): Promise<void> {
    return this.series.delete(user.id, seriesId);
  }
}
