import { Controller, Get, Param } from '@nestjs/common';
import type { Forecast, SessionUser } from '@condition-monitor/shared';
import { CurrentUser } from '../auth/current-user.decorator';
import { uuidParam } from '../common/validation/uuid-param.pipe';
import { ForecastService } from './forecast.service';

/** A prediction of the future of a time-series (challenge, section 8). */
@Controller('time-series/:id/forecast')
export class ForecastController {
  constructor(private readonly forecasts: ForecastService) {}

  @Get()
  get(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Time-series')) seriesId: string,
  ): Promise<Forecast> {
    return this.forecasts.forecast(user.id, seriesId);
  }
}
