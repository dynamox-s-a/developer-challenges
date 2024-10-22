import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMonitoringPointDto {
  @IsNotEmpty({message: 'The name of the point is required'})
  @ApiProperty({ example: 'Máquina nova', description: 'The name of the point' })
  name: string;
}
