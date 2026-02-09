import { Module } from "@nestjs/common";
import { SensorDataController } from "./sensorData.controller";
import { SensorDataService } from "./sensorData.service";
import { PrismaService } from "src/prisma/client";
import { PrismaSensorDataRepo } from "./repository/prismaSensorData.repository";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [SensorDataController],
    providers: [SensorDataService, PrismaService, { provide: "SensorDataRepo", useClass: PrismaSensorDataRepo }, JwtService]
})
export class SensorDataModule { }