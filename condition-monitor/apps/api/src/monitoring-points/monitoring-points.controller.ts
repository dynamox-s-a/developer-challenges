import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  createPositionsSchema,
  listPointsQuerySchema,
  updatePointSchema,
  type MonitoringPoint,
  type Page,
  type SessionUser,
} from '@condition-monitor/shared';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from '../auth/current-user.decorator';
import { uuidParam } from '../common/validation/uuid-param.pipe';
import { MonitoringPointsService } from './monitoring-points.service';

class CreatePositionsDto extends createZodDto(createPositionsSchema) {}
class UpdatePointDto extends createZodDto(updatePointSchema) {}
class ListPointsQueryDto extends createZodDto(listPointsQuerySchema) {}

/** Monitoring point routes of the API contract, including the challenge's paginated list. */
@Controller()
export class MonitoringPointsController {
  constructor(private readonly points: MonitoringPointsService) {}

  @Get('monitoring-points')
  list(
    @CurrentUser() user: SessionUser,
    @Query() query: ListPointsQueryDto,
  ): Promise<Page<MonitoringPoint>> {
    return this.points.list(user.id, query);
  }

  @Post('machines/:id/monitoring-points')
  create(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Machine')) machineId: string,
    @Body() body: CreatePositionsDto,
  ): Promise<{ items: MonitoringPoint[] }> {
    return this.points.createPositions(user.id, machineId, body);
  }

  @Get('monitoring-points/:id')
  get(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Monitoring point')) id: string,
  ): Promise<MonitoringPoint> {
    return this.points.get(user.id, id);
  }

  @Patch('monitoring-points/:id')
  update(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Monitoring point')) id: string,
    @Body() body: UpdatePointDto,
  ): Promise<MonitoringPoint> {
    return this.points.update(user.id, id, body);
  }

  @Delete('monitoring-points/:id')
  @HttpCode(204)
  delete(
    @CurrentUser() user: SessionUser,
    @Param('id', uuidParam('Monitoring point')) id: string,
  ): Promise<void> {
    return this.points.delete(user.id, id);
  }
}
