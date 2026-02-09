import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSensorDataDTO {
    
    @IsNotEmpty() @IsNumber() @IsOptional()
    temp?: number;
    
    @IsNotEmpty() @IsNumber() @IsOptional()
    vibration?: number;
    
    @IsNotEmpty() @IsUUID() @IsString()
    sensorId: string;
    
    @IsNotEmpty() @IsDateString()
    timestamp: string;
}