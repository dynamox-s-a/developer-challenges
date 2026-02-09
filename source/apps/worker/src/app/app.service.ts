import { Injectable } from '@nestjs/common';
import { prisma, redis } from '@source/persistence';

@Injectable()
export class AppService {
  async processTelemetry(data: { 
    sensorId: string; 
    accelerationValue: number; 
    velocityValue: number; 
    temperatureValue: number; 
    timestamp?: string 
  }) {
    const { sensorId, accelerationValue, velocityValue, temperatureValue } = data;
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

    console.log(`Processing telemetry for sensor ${sensorId}: A:${accelerationValue} V:${velocityValue} T:${temperatureValue}`);

    try {
      // 1. Validate if sensor exists (avoid FK violation)
      const sensorExists = await prisma.sensor.findUnique({
        where: { id: sensorId },
      });

      if (!sensorExists) {
        console.warn(`[Worker] Received telemetry for non-existent sensor: ${sensorId}. Ignoring.`);
        return;
      }

      // 2. Store in PostgreSQL
      await prisma.telemetry.create({
        data: {
          sensorId,
          accelerationValue,
          velocityValue,
          temperatureValue,
          timestamp,
        },
      });

      // 2. Update Global Counter in Redis
      await redis.incr('telemetry:global:total_count');

      // 3. Update Latest State in Redis (Hash)
      await redis.hset(`telemetry:sensor:${sensorId}:latest`, {
        accelerationValue: accelerationValue.toString(),
        velocityValue: velocityValue.toString(),
        temperatureValue: temperatureValue.toString(),
        timestamp: timestamp.toISOString(),
      });

      // 4. Update Stream (List/Stream for real-time charts)
      const updatePayload = { 
        sensorId,
        accelerationValue, 
        velocityValue, 
        temperatureValue, 
        timestamp 
      };
      
      await redis.lpush(`telemetry:sensor:${sensorId}:stream`, JSON.stringify(updatePayload));
      await redis.ltrim(`telemetry:sensor:${sensorId}:stream`, 0, 999); // Keep last 1000 points

      // 5. Publish to Redis Pub/Sub for Real-Time UI
      await redis.publish('telemetry.updates', JSON.stringify(updatePayload));
    } catch (error) {
      console.error('Error processing telemetry:', error);
    }
  }

  async handleSensorUpdate(data: any) {
    console.log('Sensor update received:', data);
    // Logic to sync cache or similar if needed
  }
}
