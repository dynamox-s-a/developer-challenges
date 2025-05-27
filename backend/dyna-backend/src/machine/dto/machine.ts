import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { StatusMachine } from '@prisma/client';

export enum Type {
    PUMP = "PUMP",
    FAN = "FAN"
}

export enum SensorType {
    HFp = "HFp",
    TcAs = "TcAs",
    TcAg = "TcAg"
}

export class CreateMachinesDto {
    @IsNotEmpty()
    name: string;

    @IsEnum(Type)
    typeOfMachine: Type;

    @IsEnum(StatusMachine)
    statusMachine: StatusMachine;

    @IsOptional()
    @IsNumber()
    pointmonitoring1?: number;

    @IsOptional()
    @IsNumber()
    pointmonitoring2?: number;
}

export class CreatePMonitoring {
    @IsOptional()
    @IsString()
    name?: string;

    @IsEnum(SensorType)
    sensorType: SensorType;
}

