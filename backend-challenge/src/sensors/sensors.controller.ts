import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('sensors')
@ApiBearerAuth()
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post(':machineId/:pointId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new sensor' })
  @ApiParam({ name: 'machineId', type: String })
  @ApiParam({ name: 'pointId', type: String })
  @ApiBody({ type: CreateSensorDto })
  create(
    @Body() createSensorDto: CreateSensorDto, 
    @Request() req: any, 
    @Param('machineId') machineId: string,
    @Param('pointId') pointId: string
  ) {
    return this.sensorsService.create(createSensorDto, req, machineId, pointId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all sensors' })
  @ApiParam({ name: 'id', type: String })
  findAll() {
    return this.sensorsService.findAll();
  }

  @Get('details')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get details with name machine, machine type, monitoring point name e model sensor' })
  getSensorDetails() {
    return this.sensorsService.getSensorDetails();
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.sensorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a sensor by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateSensorDto })
  update(@Param('id') id: string, @Body() updateSensorDto: UpdateSensorDto) {
    return this.sensorsService.update(id, updateSensorDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a sensor by ID' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.sensorsService.remove(id);
  }
}
