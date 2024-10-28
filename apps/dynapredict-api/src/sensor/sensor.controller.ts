import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AuthUser, User } from '../auth/user.decorator';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorService } from './sensor.service';

@Controller('monitoring-points/:monitoringPointId/sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  async create(
    @Body() createSensorDto: CreateSensorDto,
    @Param('monitoringPointId', ParseIntPipe) monitoringPointId: number,
    @User() user: AuthUser
  ) {
    return await this.sensorService.create(
      createSensorDto,
      monitoringPointId,
      user.id
    );
  }
}
