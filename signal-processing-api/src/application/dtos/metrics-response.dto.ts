export class MetricDataDto {
  datetime: string;
  max: number;
  rms?: number;
  kurtosis?: number;
  skewness?: number;
}

export class MetricsResponseDto {
  name: string;
  data: MetricDataDto[];
}
