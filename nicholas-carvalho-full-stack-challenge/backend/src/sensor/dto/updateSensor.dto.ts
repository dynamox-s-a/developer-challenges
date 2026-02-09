import { SensorModel } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateSensorDTO {
    @IsNotEmpty() @IsString() @IsOptional()
    sensorUid?: string;

    @IsNotEmpty() @IsEnum(SensorModel) @IsOptional()
    model?: SensorModel;

    @IsNotEmpty() @IsUUID() @IsOptional()
    monitoringPointId?: string;
}