import { PartialType } from "@nestjs/mapped-types";
import { CreateMachinesDto, CreatePointOfMonitoringDTO } from "./machine.dto";


export class UpdateMachinesDTO extends PartialType(CreateMachinesDto){}
