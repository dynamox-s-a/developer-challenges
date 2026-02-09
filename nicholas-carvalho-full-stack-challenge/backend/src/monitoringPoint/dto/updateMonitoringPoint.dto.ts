import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class updateMonitoringPointDTO {
    @IsNotEmpty() @IsOptional() @IsString()
    name: string;

    @IsNotEmpty() @IsOptional() @IsUUID()
    machineId: string;
}