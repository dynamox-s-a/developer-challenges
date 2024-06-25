import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { MachineService } from './machine.service'
import { CreateMachineDto } from './dto/create-machine.dto'
import { UpdateMachineDto } from './dto/update-machine.dto'


@Controller('machine')
export class MachineController {
    constructor(private readonly machineService: MachineService) { }

    
    @Post()
    create(@Body() createMachineDto: CreateMachineDto) {
        return this.machineService.create(createMachineDto)
    }

    @Get()
    findAll() {
        return this.machineService.findAll()
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.machineService.findByMachineId(+id)
    }

    @Get('user/:id')
    findByUserId(@Param('id') id: string) {
        return this.machineService.findByUserId(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
        const response = this.machineService.update(+id, updateMachineDto)
        console.log(response)
        return response
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.machineService.remove(+id)
    }
}
