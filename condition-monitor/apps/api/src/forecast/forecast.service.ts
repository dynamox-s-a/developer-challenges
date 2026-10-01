import { Injectable } from '@nestjs/common';
import { FORECAST, quantityMapping, type Forecast } from '@condition-monitor/shared';
import { notFound } from '../common/problem/problems';
import { buildForecast } from './build-forecast';
import { ForecastCache } from './forecast-cache';
import { ForecastRepository } from './forecast.repository';

/**
 * The next 24 hours of a series, with the band they should fall within and how the model
 * did on history it had not seen (docs/forecast-study.md). The fit is a closed formula
 * over at most 30 days of hourly means; its result is kept until the series receives or
 * loses a reading.
 */
@Injectable()
export class ForecastService {
  private readonly cache = new ForecastCache<Forecast>();

  constructor(private readonly repository: ForecastRepository) {}

  async forecast(ownerId: string, seriesId: string): Promise<Forecast> {
    // Asked on every request, kept or not: it is also what says the series is the user's.
    const state = await this.repository.stateOfOwned(ownerId, seriesId);
    if (!state) throw notFound('Time-series');

    const signature = `${state.readingCount}|${state.latest?.toISOString() ?? ''}`;
    return this.cache.get(seriesId, signature, async () => {
      // One hour more than the history used: the latest hour is left out as incomplete.
      const means = await this.repository.hourlyMeans(seriesId, FORECAST.maxHistoryHours);
      // An RMS is never negative; a temperature may be.
      const floor = quantityMapping.fromDb(state.quantity) === 'temperature' ? null : 0;
      return buildForecast(means, floor);
    });
  }
}
