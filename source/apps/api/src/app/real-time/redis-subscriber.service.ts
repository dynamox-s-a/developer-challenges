import { Injectable, OnModuleInit, OnModuleDestroy, Inject, forwardRef } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TelemetryGateway } from './telemetry.gateway';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(
    private readonly telemetryGateway: TelemetryGateway,
    @Inject(forwardRef(() => StatsService))
    private readonly statsService: StatsService,
  ) {
    this.redisClient = new Redis(process.env['REDIS_URL'] || 'redis://localhost:6379');
    
    this.redisClient.on('error', (err) => {
      console.warn('Redis Subscriber connection error:', err.message);
    });
  }

  onModuleInit() {
    this.redisClient.subscribe('telemetry.updates', (err, count) => {
      if (err) {
        console.error('Failed to subscribe to Redis channel:', err);
        return;
      }
      console.log(`Subscribed to ${count} channels. Listening for telemetry updates...`);
    });

    this.redisClient.on('message', async (channel, message) => {
      if (channel === 'telemetry.updates') {
        const payload = JSON.parse(message);
        this.telemetryGateway.broadcastTelemetry(payload);
        
        // Push stats updates
        await this.statsService.broadcastTotalTelemetry();
        await this.statsService.broadcastActiveSensorsCount();
      }
    });
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }
}
