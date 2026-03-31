import { ApiProperty } from '@nestjs/swagger';

export class TimeSeriesDataPointResponseDto {
  @ApiProperty({ example: '2023-11-07T11:53:38.187Z' })
  datetime: string;

  @ApiProperty({ example: 0.0023 })
  value: number;
}

export class TimeSeriesResponseDto {
  @ApiProperty({ example: 'accelerationRms/x' })
  name: string;

  @ApiProperty({ example: 'sensor-001' })
  sensorId: string;

  @ApiProperty({ example: 1000 })
  sampleRate: number;

  @ApiProperty({ example: 'g' })
  unit: string;

  @ApiProperty({ type: [TimeSeriesDataPointResponseDto] })
  data: TimeSeriesDataPointResponseDto[];
}
