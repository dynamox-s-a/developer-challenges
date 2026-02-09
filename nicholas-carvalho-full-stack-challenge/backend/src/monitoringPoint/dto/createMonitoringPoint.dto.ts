import { IsNotEmpty,  IsString, IsUUID } from "class-validator";

export class CreateMonitoringPointDTO {
    @IsNotEmpty() @IsString()
    name: string;

    @IsNotEmpty() @IsString() @IsUUID()
    machineId: string;
}