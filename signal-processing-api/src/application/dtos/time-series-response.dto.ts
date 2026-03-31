export class TimeSeriesDataPointResponseDto {
  datetime: string;
  value: number;
}

export class TimeSeriesResponseDto {
  name: string;
  sensorId: string;
  sampleRate: number;
  unit: string;
  data: TimeSeriesDataPointResponseDto[];
}
