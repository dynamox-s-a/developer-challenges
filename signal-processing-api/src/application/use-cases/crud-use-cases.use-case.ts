import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TIME_SERIES_REPOSITORY } from '../../domain/repositories/time-series.repository';
import type { ITimeSeriesRepository } from '../../domain/repositories/time-series.repository';
import { TimeSeriesResponseDto } from '../dtos/time-series-response.dto';

@Injectable()
export class DeleteTimeSeriesUseCase {
  constructor(
    @Inject(TIME_SERIES_REPOSITORY)
    private readonly repository: ITimeSeriesRepository
  ) {}

  public async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

@Injectable()
export class CountTimeSeriesUseCase {
  constructor(
    @Inject(TIME_SERIES_REPOSITORY)
    private readonly repository: ITimeSeriesRepository
  ) {}

  public async execute(): Promise<{ total: number }> {
    const total = await this.repository.count();
    return { total };
  }
}

@Injectable()
export class GetTimeSeriesUseCase {
  constructor(
    @Inject(TIME_SERIES_REPOSITORY)
    private readonly repository: ITimeSeriesRepository
  ) {}

  public async execute(id: string): Promise<TimeSeriesResponseDto> {
    const series = await this.repository.getById(id);
    if (!series) {
      throw new NotFoundException(`Time series with ID ${id} not found`);
    }

    return {
      name: series.name.value,
      sensorId: series.sensorId,
      sampleRate: series.sampleRate,
      unit: series.unit.value,
      data: series.data.map(p => ({
        datetime: p.datetime.value,
        value: p.value
      }))
    };
  }
}
