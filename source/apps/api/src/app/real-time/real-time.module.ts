import { Module, forwardRef } from '@nestjs/common';
import { TelemetryGateway } from './telemetry.gateway';
import { RedisSubscriberService } from './redis-subscriber.service';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [forwardRef(() => StatsModule)],
  providers: [TelemetryGateway, RedisSubscriberService],
  exports: [TelemetryGateway],
})
export class RealTimeModule {}
