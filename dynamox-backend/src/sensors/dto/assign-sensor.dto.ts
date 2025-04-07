import { IsString, IsIn, IsUUID } from 'class-validator';

export class AssignSensorDto {
  @IsIn(['TcAg', 'TcAs', 'HF+'])
  model: string;

  @IsString()
  machineId: string;

  @IsUUID()
  monitoringPointId: string;
}
