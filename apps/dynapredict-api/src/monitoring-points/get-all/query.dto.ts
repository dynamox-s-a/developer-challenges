import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsEnum(
    ['machine_name', 'machine_type', 'monitoring_point_name', 'sensor_model'],
    {
      message:
        'sortBy must be one of the following values: machine_name, machine_type, monitoring_point_name, sensor_model',
    }
  )
  sortBy?: string = 'machine_name';

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'sortOrder must be either asc or desc' })
  sortOrder?: 'asc' | 'desc' = 'asc';
}
