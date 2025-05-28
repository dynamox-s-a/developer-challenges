import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { StatusMachine, SensorType } from '@prisma/client';

export enum Type {
    PUMP = "PUMP",
    FAN = "FAN"
}

export class CreatePointOfMonitoringDTO {
    @IsOptional()
    @IsString()
    name?: string;

    @IsEnum(SensorType)
    sensorType:SensorType

}

export class CreateMachinesDto {
    @IsNotEmpty()
    name: string;

    @IsEnum(Type)
    typeOfMachine: Type;

    @IsEnum(StatusMachine)
    statusMachine: StatusMachine;

    @IsOptional()    
    pointmonitoring1?: CreatePointOfMonitoringDTO;

    @IsOptional()    
    pointmonitoring2?: CreatePointOfMonitoringDTO;
}

export class CreateLinksDTO{
    @IsOptional()
    id_pointmonitoring1?: number
    @IsOptional()
    id_pointmonitoring2?: number
}
