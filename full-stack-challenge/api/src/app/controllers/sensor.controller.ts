import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBasicAuth,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPageableParams } from 'api/src/app/core/decorators/api-pageable.decorator';
import { Page } from 'api/src/app/core/decorators/page.decorator';
import PageResult from '../core/types/page-result.type';
import Sensor from '../models/sensor.model';
import SensorService from '../services/sensor.service';

@ApiExtraModels(Sensor)
@ApiTags('Sensor')
@Controller('sensors')
@ApiBasicAuth('bearerAuth')
@UseGuards(AuthGuard('bearerAdmin'))
export default class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  @ApiQuery({
    name: 'criteria',
    type: 'string',
    description: 'param to filter results by text',
    required: false,
  })
  @ApiPageableParams(Sensor)
  async pageable(
    @Page() page,
    @Query('criteria') criteria: string
  ): Promise<PageResult<Sensor>> {
    const where: any = {};
    if (criteria) {
      where.$or = [{ name: { $regex: criteria.trim(), $options: 'i' } }];
    }
    return this.sensorService.pageable({ ...page, where });
  }

  @Get('select-sensors')
  @ApiQuery({
    name: 'criteria',
    type: 'string',
    description: 'param to filter results by text',
    required: false,
  })
  async list(@Query('criteria') criteria: string): Promise<Sensor[]> {
    return this.sensorService.selectSensors({ criteria });
  }
}
