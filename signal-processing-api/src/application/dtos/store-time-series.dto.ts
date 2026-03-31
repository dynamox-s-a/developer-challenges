import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DataPointDto {
  @ApiProperty({ example: '2023-11-07T11:53:38.187Z' })
  @IsString()
  @IsNotEmpty()
  datetime: string;

  @ApiProperty({ example: 0.0023 })
  @IsNumber()
  value: number;
}

export class StoreTimeSeriesDto {
  @ApiProperty({ example: 'accelerationRms/x' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sensor-001' })
  @IsString()
  @IsNotEmpty()
  sensorId: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  sampleRate: number;

  @ApiProperty({ example: 'g', required: false })
  @IsString()
  @IsOptional()
  unit: string;

  @ApiProperty({ type: [DataPointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataPointDto)
  data: DataPointDto[];
}
