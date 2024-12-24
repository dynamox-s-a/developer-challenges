import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEnum(['Pump', 'Fan'])
  @IsNotEmpty()
  readonly type: 'Pump' | 'Fan';

  @IsArray()
  @IsOptional()
  readonly monitoringPoints?: { name: string; sensorId: string | null }[];
}
