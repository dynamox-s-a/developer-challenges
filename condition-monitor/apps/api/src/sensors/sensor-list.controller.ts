import { Controller, Get, Query } from '@nestjs/common';
import {
  listSensorsQuerySchema,
  type SensorInstallation,
  type SessionUser,
} from '@condition-monitor/shared';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from '../auth/current-user.decorator';
import { SensorsService } from './sensors.service';

class ListSensorsQueryDto extends createZodDto(listSensorsQuerySchema) {}

/**
 * The installed sensors of the user. It is how the simulator discovers what to simulate
 * (C13); a serial number that is not installed is simply absent from the answer.
 */
@Controller('sensors')
export class SensorListController {
  constructor(private readonly sensors: SensorsService) {}

  @Get()
  list(
    @CurrentUser() user: SessionUser,
    @Query() query: ListSensorsQueryDto,
  ): Promise<SensorInstallation[]> {
    return this.sensors.listInstalled(user.id, query.serialNumber);
  }
}
