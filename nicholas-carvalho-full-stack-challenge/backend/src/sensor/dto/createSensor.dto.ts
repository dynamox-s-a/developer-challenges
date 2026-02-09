import { ApiProperty } from "@nestjs/swagger";
import { SensorModel } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSensorDTO {
    @ApiProperty({example: "SN_209"})
    @IsNotEmpty() @IsString()
    sensorUid: string;

    @ApiProperty({ enum: SensorModel })
    @IsNotEmpty() @IsEnum(SensorModel)
    model: SensorModel;

    @IsOptional() @IsUUID() @IsString()
    monitoringPointId?: string;
}