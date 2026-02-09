import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { prisma, redis } from '@source/persistence';
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

  async getDashboardStats() {
    const [telemetry, machines, points, active] = await Promise.all([
      this.getTotalTelemetry(),
      this.getMachinesCount(),
      this.getMonitoringPointsCount(),
      this.getActiveSensorsCount(),
    ]);

    return {
      ...telemetry,
      ...machines,
      ...points,
      ...active,
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
}
