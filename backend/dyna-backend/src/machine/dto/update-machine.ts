import { PartialType } from "@nestjs/mapped-types";
import { CreateMachinesDto } from "./machine";


export class UpdateMachinesDTO extends PartialType(CreateMachinesDto){}