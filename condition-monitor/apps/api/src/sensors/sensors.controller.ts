import { Body, Controller, Delete, HttpCode, Param, Put } from '@nestjs/common';
import {
  installSensorSchema,
  type MonitoringPoint,
  type SessionUser,
} from '@condition-monitor/shared';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from '../auth/current-user.decorator';
import { uuidParam } from '../common/validation/uuid-param.pipe';
import { SensorsService } from './sensors.service';

class InstallSensorDto extends createZodDto(installSensorSchema) {}

/**
 * The sensor of a monitoring point. A point has at most one, so it is a sub-resource and
 * PUT expresses "this is the point's sensor": installing and replacing are one operation.
 */
@Controller('monitoring-points/:id/sensor')
export class SensorsController {
  constructor(private readonly sensors: SensorsService) {}

  @Put()
  install(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Monitoring point')) pointId: string,
    @Body() body: InstallSensorDto,
  ): Promise<MonitoringPoint> {
    return this.sensors.install(user.id, pointId, body);
  }

  @Delete()
  @HttpCode(204)
  remove(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Monitoring point')) pointId: string,
  ): Promise<void> {
    return this.sensors.remove(user.id, pointId);
  }
}
