import { IsString, IsUUID } from 'class-validator';

export class CreateSensorDto {
  @IsString()
  model: 'TcAg' | 'TcAs' | 'HF_Plus';

  @IsUUID()
  monitoringPointId: string;
}
