import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { MachinesService } from "./machines.service";
import { Machine } from "@prisma/client";
import { CreateMachineDto, MachineDto } from './dto/machines.dto';

@Controller('machines')
export class MachinesController {
    constructor(
        private readonly machinesService: MachinesService,
    ) { }


    @Get()
    async getAll(): Promise<Machine[]> {
        console.log('Controller method called');
        return this.machinesService.getAll();
    }

    @Post()
    async create(@Body() machineDto: CreateMachineDto): Promise<Machine> {
        return this.machinesService.create(machineDto)
    }


    @Patch(':uuid')
    async update(
        @Param('uuid') uuid: string,
        @Body() machineDto: MachineDto
    ): Promise<Machine> {
        return this.machinesService.update(uuid, machineDto);
    }

    @Delete(':uuid')
    async delete(@Param('uuid') uuid: string): Promise<Machine> {
        return this.machinesService.delete(uuid);
    }
}