import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSpotDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  machineId: string

  @IsString()
  sensorId?: string

  @IsString()
  sensorModel?: string
}
