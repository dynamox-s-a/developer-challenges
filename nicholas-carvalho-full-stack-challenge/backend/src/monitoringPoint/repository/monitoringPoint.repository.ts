import { Injectable } from "@nestjs/common";
import { CreateMonitoringPointDTO } from "../dto/createMonitoringPoint.dto";
import { MonitoringPoint } from "@prisma/client";
import { updateMonitoringPointDTO } from "../dto/updateMonitoringPoint.dto";

@Injectable()
export abstract class MonitoringPointRepo {
    abstract findAllPaginatedPoints(page: number, search?: string): Promise<{items: MonitoringPoint[], total: number}>;
    abstract findMonitoringPointById(id: string): Promise<MonitoringPoint | null>;
    abstract createMonitoringPoint(data: CreateMonitoringPointDTO): Promise<MonitoringPoint>;
    abstract updateMonitoringPoint(data: updateMonitoringPointDTO, id: string): Promise<MonitoringPoint>;
    abstract deleteMonitoringPoint(id: string): Promise<void>;
}