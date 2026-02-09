import { IsEnum, IsString, IsNotEmpty, MinLength } from "class-validator";
import { MachineType } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMachineDTO {
    @IsNotEmpty() @IsString() @MinLength(3, {message: "Machine name must have at least 3 characters long"})
    name: string;

    @ApiProperty({enum: MachineType})
    @IsEnum(MachineType, {message: "Machine type must be either Pump or Fan!"})
    type: MachineType;

    @IsNotEmpty() @IsString()
    userId: string;
}