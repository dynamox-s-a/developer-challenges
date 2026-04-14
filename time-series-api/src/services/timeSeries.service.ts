import { AppError } from '../errors/app-error';
import { timeSeriesRepository } from '../repositories/timeSeries.repository';
import { publishTimeSeriesCreated, publishTimeSeriesDeleted } from '../producers/timeSeries.producer';
import { Sample } from '../types/timeSeries';
import { timeSeriesMetricsService } from './timeSeriesMetrics.service';

export class TimeSeriesService {
  async create(data: { name?: string; samples: Sample[] }) {
    const timeSeries = await timeSeriesRepository.create({
      name: data.name,
      samples: data.samples,
    });

    try {
      await publishTimeSeriesCreated({
        timeSeriesId: timeSeries._id.toString(),
        name: timeSeries.name,
        sampleCount: timeSeries.samples.length,
        createdAt: timeSeries.createdAt ?? new Date(),
      });
    } catch (error) {
      console.error('Failed to publish time-series.created event', error);
    }

    return timeSeries;
  }

  async getById(id: string) {
    const timeSeries = await timeSeriesRepository.findById(id);

    if (!timeSeries) {
      throw new AppError('Time series not found', 404);
    }

    return timeSeries;
  }

  async count() {
    return timeSeriesRepository.count();
  }

  async deleteById(id: string) {
    const deletedTimeSeries = await timeSeriesRepository.deleteById(id);

    if (!deletedTimeSeries) {
      throw new AppError('Time series not found', 404);
    }

    try {
      await publishTimeSeriesDeleted({
        timeSeriesId: id,
        deletedAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to publish time-series.deleted event', error);
    }
  }

  async getMetricsById(id: string) {
    const timeSeries = await this.getById(id);
    return timeSeriesMetricsService.calculate(timeSeries.samples);
  }
}

export const timeSeriesService = new TimeSeriesService();