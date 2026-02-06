import { PartialType } from "@nestjs/mapped-types";
import { CreateMonitoringPointDto } from "./create-monitoring-point.dto";
import { IsInt, IsOptional } from "class-validator";

export class UpdateMonitotingPointDto extends PartialType(CreateMonitoringPointDto) {
  @IsOptional()
  @IsInt()
  machineId?: number;
}