import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['Pump', 'Fan'], { message: 'type must be either pump or fan' })
  type: 'Pump' | 'Fan';
}
