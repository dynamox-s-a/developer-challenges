import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@ApiTags('Sensors') // Agrupa os endpoints sob a tag "Sensors" no Swagger
@UseGuards(JwtGuard)
@Controller('sensors')
export class SensorController {
  constructor(private readonly service: SensorService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new sensor' })
  @ApiResponse({ status: 201, description: 'Sensor created successfully.' })
  @ApiBody({ type: CreateSensorDto })
  create(@Body() dto: CreateSensorDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sensors' })
  @ApiResponse({ status: 200, description: 'List of all sensors.' })
  findAll() {
    return this.service.findAll();
  }
}
