import { Inject, Injectable } from '@nestjs/common';
import { TIME_SERIES_REPOSITORY } from '../../domain/repositories/time-series.repository';
import type { ITimeSeriesRepository } from '../../domain/repositories/time-series.repository';
import { TimeSeries } from '../../domain/entities/time-series.entity';
import { StoreTimeSeriesDto } from '../dtos/store-time-series.dto';
import { SensorName } from '../../domain/value-objects/sensor-name.vo';
import { MeasurementUnit } from '../../domain/value-objects/measurement-unit.vo';
import { Timestamp } from '../../domain/value-objects/timestamp.vo';

@Injectable()
export class StoreTimeSeriesUseCase {
  constructor(
    @Inject(TIME_SERIES_REPOSITORY)
    private readonly repository: ITimeSeriesRepository
  ) {}

  public async execute(dto: StoreTimeSeriesDto): Promise<string> {
    const timeSeries = new TimeSeries(
      new SensorName(dto.name),
      dto.sensorId,
      dto.sampleRate,
      new MeasurementUnit(dto.unit || 'unknown'),
      dto.data.map(p => ({
        datetime: new Timestamp(p.datetime),
        value: p.value
      }))
    );

    const id = await this.repository.save(timeSeries);
    
    // In Stage 4, we'll add Kafka publishing here or via event bus
    
    return id;
  }
}
