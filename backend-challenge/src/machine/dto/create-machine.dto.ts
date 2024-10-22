import { ApiProperty } from "@nestjs/swagger";
import { MachineType } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateMachineDto {
  @IsNotEmpty({
    message: 'The machine name is required'
  })
  @ApiProperty({ example: 'My machine', description: 'The name of the machine' })
  name: string;

  @IsEnum(MachineType, { message: 'Type must be either pump or fan' })
  type: MachineType;
}
