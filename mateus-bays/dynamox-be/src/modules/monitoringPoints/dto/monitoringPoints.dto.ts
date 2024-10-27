import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class MonitoringPointDto {
    @IsUUID()
    uuid: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUUID()
    sensorUUID: string;

    @IsNotEmpty()
    @IsUUID()
    machineUUID: string;
}

export class UpdateMonitoringPointDto extends PartialType(MonitoringPointDto) {}


export class CreateMonitoringPointDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUUID()
    sensorUUID: string;

    @IsNotEmpty()
    @IsUUID()
    machineUUID: string;
}