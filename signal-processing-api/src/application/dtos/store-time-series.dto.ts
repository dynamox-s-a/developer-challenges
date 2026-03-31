import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class DataPointDto {
  @IsString()
  @IsNotEmpty()
  datetime: string;

  @IsNumber()
  value: number;
}

export class StoreTimeSeriesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sensorId: string;

  @IsNumber()
  sampleRate: number;

  @IsString()
  @IsOptional()
  unit: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataPointDto)
  data: DataPointDto[];
}
