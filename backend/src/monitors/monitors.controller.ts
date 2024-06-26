import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common'
import { MonitorsService } from './monitors.service'
import { CreateMonitorsDto } from './dto/create-monitor.dto'
import { UpdateMonitorsDto } from './dto/update-monitor.dto'


@Controller('monitors')
export class MonitorsController {
    constructor(private readonly monitorsService: MonitorsService) { }

    
    @Post()
    create(@Body() createMonitorDto: CreateMonitorsDto) {
        return this.monitorsService.create(createMonitorDto)
    }

 
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.monitorsService.findByMonitorId(+id)
    }

    @Get('machine/:id')
    findByMachineId(@Param('id') id: string) {
        return this.monitorsService.findByMachineId(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMonitorDto: UpdateMonitorsDto) {
        const response = this.monitorsService.updateMonitor(+id, updateMonitorDto)
        console.log(response)
        return response
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.monitorsService.removeMonitor(+id)
    }
}
