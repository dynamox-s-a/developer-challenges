import { IsIn, IsString } from 'class-validator';

export class AddMonitoringPointsDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsIn(['TcAg', 'TcAs', 'HF+'])
  readonly sensorModel: string;

  @IsString()
  readonly sensorId: string;
}
