import { Injectable } from "@nestjs/common";
import { Sensor } from "@prisma/client";
import { CreateSensorDTO } from "../dto/createSensor.dto";
import { UpdateSensorDTO } from "../dto/updateSensor.dto";

@Injectable()
export abstract class SensorRepo {
    abstract findManySensors(): Promise<Sensor[]>;
    abstract findUniqueSensor(id: string): Promise<Sensor | null>;
    abstract findSensorByMonitoringPointId(monitoringPointId: string): Promise<Sensor | null>;
    abstract findSensorByUid(sensorUid: string): Promise<Sensor | null>;
    abstract createSensor(data: CreateSensorDTO): Promise<Sensor>;
    abstract updateSensor(data: UpdateSensorDTO, id: string): Promise<Sensor>;
    abstract deleteSensor(id: string): Promise<void>;
}