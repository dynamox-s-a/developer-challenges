import { Module } from '@nestjs/common';
import { TelemetryGateway } from './telemetry.gateway';
import { RedisSubscriberService } from './redis-subscriber.service';

@Module({
  providers: [TelemetryGateway, RedisSubscriberService],
  exports: [TelemetryGateway],
})
export class RealTimeModule {}
