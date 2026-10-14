import type {
  CreateReadingsInput,
  DeleteReadingsResult,
  InsertReadingsResult,
  Reading,
  ReadingsMetrics,
  ReadingsMetricsQuery,
  ReadingsRangeQuery,
  TimeSeriesCount,
} from "@full-stack-solution/shared";
import { NotFoundError } from "../../shared/errors/app-error";
import type { TimeSeriesRepository } from "./time-series.repository";

export class TimeSeriesService {
  constructor(private readonly repository: TimeSeriesRepository) {}

  async insert(
    pointId: string,
    userId: string,
    input: CreateReadingsInput,
  ): Promise<InsertReadingsResult> {
    await this.assertOwnership(pointId, userId);
    return this.repository.insertReadings(pointId, input);
  }

  async getReadings(
    pointId: string,
    userId: string,
    query: ReadingsRangeQuery,
  ): Promise<Reading[]> {
    await this.assertOwnership(pointId, userId);
    return this.repository.getReadings(pointId, query);
  }

  async getMetrics(
    pointId: string,
    userId: string,
    query: ReadingsMetricsQuery,
  ): Promise<ReadingsMetrics> {
    await this.assertOwnership(pointId, userId);
    return this.repository.getMetrics(pointId, query);
  }

  countByUser(userId: string): Promise<TimeSeriesCount> {
    return this.repository.countByUser(userId);
  }

  async deleteReadings(
    pointId: string,
    userId: string,
    query: ReadingsRangeQuery,
  ): Promise<DeleteReadingsResult> {
    await this.assertOwnership(pointId, userId);
    return this.repository.deleteReadings(pointId, query);
  }

  private async assertOwnership(
    pointId: string,
    userId: string,
  ): Promise<void> {
    if (!(await this.repository.pointBelongsToUser(pointId, userId))) {
      throw new NotFoundError("Monitoring point");
    }
  }
}
