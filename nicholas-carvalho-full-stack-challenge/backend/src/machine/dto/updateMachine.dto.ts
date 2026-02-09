import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { MachineType } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateMachineDTO {
    @IsOptional() @IsNotEmpty() @IsString() @MinLength(3, {message: "Machine name must have at least 3 characters long"})
    name?: string;

    @ApiProperty({enum: MachineType})
    @IsOptional() @IsEnum(MachineType, {message: "Machine type must be either Pump or Fan!"})
    type?: MachineType;

    @IsOptional() @IsNotEmpty() @IsString()
    userId?: string;
}