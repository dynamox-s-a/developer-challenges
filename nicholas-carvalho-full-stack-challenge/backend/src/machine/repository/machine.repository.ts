import { Machine } from "@prisma/client";
import { CreateMachineDTO } from "../dto/createMachine.dto";
import { UpdateMachineDTO } from "../dto/updateMachine.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class MachineRepo {
    abstract findManyByUser(userId: string): Promise<Machine[]>;
    abstract findManyMachines(): Promise<Machine[]>;
    abstract findUniqueMachine(id: string): Promise<Machine | null>;
    abstract findMachineByName(name: string): Promise<Machine | null>;
    abstract createMachine(data: CreateMachineDTO): Promise<Machine>;
    abstract updateMachine(data: UpdateMachineDTO, id: string): Promise<Machine>;
    abstract deleteMachine(id: string): Promise<void>;
}