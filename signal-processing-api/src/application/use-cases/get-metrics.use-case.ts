import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TIME_SERIES_REPOSITORY } from '../../domain/repositories/time-series.repository';
import type { ITimeSeriesRepository } from '../../domain/repositories/time-series.repository';
import { MetricsResponseDto } from '../dtos/metrics-response.dto';

@Injectable()
export class GetMetricsUseCase {
  constructor(
    @Inject(TIME_SERIES_REPOSITORY)
    private readonly repository: ITimeSeriesRepository
  ) {}

  public async execute(id: string): Promise<MetricsResponseDto[]> {
    const results = await this.repository.getMetrics(id);
    
    if (!results || results.length === 0) {
      throw new NotFoundException(`Time series with ID ${id} not found`);
    }

    // Mapping repository aggregate results to public DTO contract
    return results.map(r => ({
      name: r.name,
      data: r.data.map(d => ({
        datetime: d.datetime,
        max: d.max,
        rms: d.rms,
        kurtosis: d.kurtosis,
        skewness: d.skewness,
      }))
    }));
  }
}
