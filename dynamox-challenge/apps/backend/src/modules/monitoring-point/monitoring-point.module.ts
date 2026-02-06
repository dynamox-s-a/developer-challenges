import { Module } from "@nestjs/common";
import { MonitoringPointController } from "./monitoring-point.controller";
import { MonitoringPointService } from "./monitoring-point.service";




@Module({
  controllers:[MonitoringPointController],
  providers: [MonitoringPointService],
})

export class MonitoringPointModule {};