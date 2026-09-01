import { Module } from '@nestjs/common';

import { AlertsQueryService } from './alerts-query.service';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, AlertsQueryService],
  exports: [AlertsService],
})
export class AlertsModule {}
