import { SensorName } from '../value-objects/sensor-name.vo';
import { Timestamp } from '../value-objects/timestamp.vo';
import { MeasurementUnit } from '../value-objects/measurement-unit.vo';

export interface TimeSeriesDataPoint {
  datetime: Timestamp;
  value: number;
}

export class TimeSeries {
  constructor(
    public readonly name: SensorName,
    public readonly sensorId: string,
    public readonly sampleRate: number,
    public readonly unit: MeasurementUnit,
    public readonly data: TimeSeriesDataPoint[]
  ) {
    if (sampleRate <= 0) {
      throw new Error('Sample rate must be greater than 0');
    }
    if (!data || data.length === 0) {
      throw new Error('Time series must contain at least one data point');
    }
  }

  /**
   * Retorna a quantidade total de medições da série
   */
  public getTotalMeasurements(): number {
    return this.data.length;
  }
}
