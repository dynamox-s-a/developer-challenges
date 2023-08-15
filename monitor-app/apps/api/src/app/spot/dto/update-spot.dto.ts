import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateSpotDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  machineId: string

  @IsString()
  @IsOptional()
  sensorId?: string

  @IsString()
  @IsOptional()
  sensorModel?: string
}
