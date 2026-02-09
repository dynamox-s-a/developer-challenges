import { Controller, Get, Param, UseGuards, Inject, Query, Delete, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
@UseGuards(AuthGuard('jwt'))
export class TelemetryController {
  constructor(
    @Inject(TelemetryService)
    private readonly telemetryService: TelemetryService
  ) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.telemetryService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      sortField,
      sortOrder
    );
  }

  @Get('metrics')
  async getMetrics() {
    return this.telemetryService.getMetrics();
  }

  @Get(':id')
  async getHistory(@Param('id') sensorId: string) {
    return this.telemetryService.getHistoryBySensor(sensorId);
  }

  @Delete()
  async delete(@Query('ids') ids?: string) {
    if (!ids) return;
    const idArray = ids.split(',').map((id) => parseInt(id, 10));
    if (idArray.length === 1) {
      return this.telemetryService.deleteOne(idArray[0]);
    }
    return this.telemetryService.deleteMany(idArray);
  }
}
