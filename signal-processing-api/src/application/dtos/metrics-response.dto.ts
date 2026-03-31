import { ApiProperty } from '@nestjs/swagger';

export class MetricDataDto {
  @ApiProperty({ example: '2023-11-07T11:53:38.187Z' })
  datetime: string;

  @ApiProperty({ example: 0.5 })
  max: number;

  @ApiProperty({ example: 0.3, required: false })
  rms?: number;

  @ApiProperty({ example: 3.0, required: false })
  kurtosis?: number;

  @ApiProperty({ example: 0.1, required: false })
  skewness?: number;
}

export class MetricsResponseDto {
  @ApiProperty({ example: 'accelerationRms/x' })
  name: string;

  @ApiProperty({ type: [MetricDataDto] })
  data: MetricDataDto[];
}
