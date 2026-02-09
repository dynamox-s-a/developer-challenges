import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { prisma, redis, SensorModel } from '@source/persistence';
import { TelemetryGateway } from '../real-time/telemetry.gateway';

@Injectable()
export class StatsService {
  constructor(
    @Inject(forwardRef(() => TelemetryGateway))
    private readonly telemetryGateway: TelemetryGateway,
  ) {}

  async getTotalTelemetry() {
    const count = await redis.get('telemetry:global:total_count');
    return { totalTelemetry: count ? parseInt(count, 10) : 0 };
  }

  async getMachinesCount() {
    const count = await prisma.machine.count();
    return { machinesCount: count };
  }

  async getMonitoringPointsCount() {
    const count = await prisma.monitoringPoint.count();
    return { monitoringPointsCount: count };
  }

  async getActiveSensorsCount() {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const count = await redis.zcount('sensors:active', oneMinuteAgo, '+inf');
    return { activeSensorsCount: count };
  }

  async getSensorsDistribution() {
    const counts = await prisma.sensor.groupBy({
      by: ['model'],
      _count: {
        id: true,
      },
    });

    const total = counts.reduce((acc, curr) => acc + curr._count.id, 0);
    
    // Default zero distribution
    const distribution = {
      [SensorModel.TcAg]: 0,
      [SensorModel.TcAs]: 0,
      [SensorModel.HF_Plus]: 0,
    };

    if (total > 0) {
      counts.forEach((c) => {
        distribution[c.model] = Math.round((c._count.id / total) * 100);
      });
    }

    return distribution;
  }
  async getTelemetryTrend() {
    const totalCount = await prisma.telemetry.count();
    if (totalCount === 0) {
      return {
        timestamps: [],
        acceleration: [],
        velocity: [],
        temperature: [],
      };
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const trend: any[] = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('minute', "timestamp") AS minute,
        AVG("accelerationValue")::FLOAT AS "avgAcceleration",
        AVG("velocityValue")::FLOAT AS "avgVelocity",
        AVG("temperatureValue")::FLOAT AS "avgTemperature"
      FROM telemetry
      WHERE "timestamp" >= ${oneHourAgo}
      GROUP BY minute
      ORDER BY minute ASC
    `;

    return {
      timestamps: trend.map((t) => t.minute),
      acceleration: trend.map((t) => t.avgAcceleration),
      velocity: trend.map((t) => t.avgVelocity),
      temperature: trend.map((t) => t.avgTemperature),
    };
  }

  async getDashboardStats() {
    const [telemetry, machines, points, active, distribution, trend] = await Promise.all([
      this.getTotalTelemetry(),
      this.getMachinesCount(),
      this.getMonitoringPointsCount(),
      this.getActiveSensorsCount(),
      this.getSensorsDistribution(),
      this.getTelemetryTrend(),
    ]);

    return {
      ...telemetry,
      ...machines,
      ...points,
      ...active,
      sensorsDistribution: distribution,
      telemetryTrend: trend,
    };
  }

  async broadcastTotalTelemetry() {
    const stats = await this.getTotalTelemetry();
    this.telemetryGateway.broadcastTotalTelemetry(stats);
  }

  async broadcastMachinesCount() {
    const stats = await this.getMachinesCount();
    this.telemetryGateway.broadcastMachinesCount(stats);
  }

  async broadcastMonitoringPointsCount() {
    const stats = await this.getMonitoringPointsCount();
    this.telemetryGateway.broadcastMonitoringPointsCount(stats);
  }

  async broadcastActiveSensorsCount() {
    const stats = await this.getActiveSensorsCount();
    this.telemetryGateway.broadcastActiveSensorsCount(stats);
  }

  async broadcastSensorsDistribution() {
    const distribution = await this.getSensorsDistribution();
    this.telemetryGateway.broadcastSensorsDistribution(distribution);
  }
}
