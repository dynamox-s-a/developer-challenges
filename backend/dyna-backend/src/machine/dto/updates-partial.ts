import { PartialType } from "@nestjs/mapped-types";
import { CreateMachinesDto, CreatePointOfMonitoringDTO } from "./machine";


export class UpdateMachinesDTO extends PartialType(CreateMachinesDto){}
