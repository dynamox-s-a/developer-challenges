import { Injectable } from "@nestjs/common";
import { SensorData } from "@prisma/client";
import { CreateSensorDataDTO } from "../dto/createSensorData.dto";

@Injectable()
export abstract class SensorDataRepo {
    abstract findAllSensorData(): Promise<SensorData[]>;
    abstract countSensorData(sensorId: string): Promise<number>;
    abstract getMetrics(sensorId: string);
    abstract findManySensorData(sensorId: string, startTime: Date | undefined, endTime: Date | undefined): Promise<SensorData[]>;
    abstract findUniqueSensorData(id: string): Promise<SensorData | null>;
    abstract createSensorData(data: CreateSensorDataDTO): Promise<SensorData>;
    abstract deleteSensorData(id: string): Promise<void>;
}