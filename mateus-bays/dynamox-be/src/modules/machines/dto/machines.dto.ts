import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum MachineTypeEnum {
    Pump = 'Pump',
    Fan = 'Fan',
}

export class UpdateMachineDto implements Partial<MachineDto> {};


export class MachineDto {
    @IsUUID()
    uuid: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(MachineTypeEnum) 
    type: MachineTypeEnum;
}

export class CreateMachineDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsEnum(MachineTypeEnum) 
    type: MachineTypeEnum;
}