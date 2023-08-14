import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateMachineDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  type: string
}
