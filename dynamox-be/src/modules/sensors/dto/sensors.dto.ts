import { IsNotEmpty, IsString, IsUUID } from 'class-validator';


export class SensorDto {
    @IsUUID()
    uuid: string;

    @IsNotEmpty()
    @IsString()
    modelName: string;
}

