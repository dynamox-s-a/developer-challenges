import { Module } from "@nestjs/common";
import { MonitoringPointController } from "./monitoringPoint.controller";
import { MonitoringPointService } from "./monitoringPoint.service";
import { PrismaService } from "src/prisma/client";
import { PrismaMonitoringPoint } from "./repository/prismaMonitoringPoint.repository";
import { JwtService } from "@nestjs/jwt";
import { PrismaMachineRepo } from "src/machine/repository/prismaMachine.repository";

@Module({
    controllers: [MonitoringPointController],
    providers: [MonitoringPointService, PrismaService, { provide: "MonitoringPointRepo", useClass: PrismaMonitoringPoint },{provide: "MachineRepo", useClass: PrismaMachineRepo} , JwtService]
})
export class MonitoringPointModule { }