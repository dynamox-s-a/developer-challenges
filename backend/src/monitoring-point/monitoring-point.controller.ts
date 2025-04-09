import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MonitoringPointService } from './monitoring-point.service';
import { CreateMonitoringPointDto, UpdateMonitoringPointDto } from './dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@ApiTags('Monitoring Points') // Agrupa os endpoints sob a tag "Monitoring Points" no Swagger
@UseGuards(JwtGuard)
@Controller('monitoring-points')
export class MonitoringPointController {
  constructor(private readonly service: MonitoringPointService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new monitoring point' })
  @ApiResponse({
    status: 201,
    description: 'Monitoring point created successfully.',
  })
  @ApiBody({ type: CreateMonitoringPointDto })
  create(@Body() dto: CreateMonitoringPointDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all monitoring points' })
  @ApiResponse({ status: 200, description: 'List of all monitoring points.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a monitoring point by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the monitoring point',
  })
  @ApiResponse({ status: 200, description: 'Monitoring point details.' })
  @ApiResponse({ status: 404, description: 'Monitoring point not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a monitoring point by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the monitoring point',
  })
  @ApiBody({ type: UpdateMonitoringPointDto })
  @ApiResponse({
    status: 200,
    description: 'Monitoring point updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Monitoring point not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMonitoringPointDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a monitoring point by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the monitoring point',
  })
  @ApiResponse({
    status: 200,
    description: 'Monitoring point deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Monitoring point not found.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
