import { 
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/updtate-sensor.dto';

@Controller('sensor')
export class SensorController {
    constructor(private readonly sensorService: SensorService) { }

    @Post()
    create(@Body() createSensorDto: CreateSensorDto) {
        return this.sensorService.create(createSensorDto)
    }

    @Get()
    findAll() {
        return this.sensorService.findAll()
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.sensorService.findBySensorId(+id)
    }

    @Get('monitor/:id')
    findByMachineId(@Param('id') id: string) {
        return this.sensorService.findByMonitoringPointId(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSensorDto: UpdateSensorDto) {
        return this.sensorService.update(+id, updateSensorDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sensorService.remove(+id)
    }
}
