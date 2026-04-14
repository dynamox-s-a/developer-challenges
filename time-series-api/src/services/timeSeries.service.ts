import { AppError } from '../errors/app-error';
import { timeSeriesRepository } from '../repositories/timeSeries.repository';
import { timeSeriesMetricsService } from './timeSeriesMetrics.service';
import { Sample } from '../types/timeSeries';

export class TimeSeriesService {
  async create(data: { name?: string; samples: Sample[] }) {
    return timeSeriesRepository.create({
      name: data.name,
      samples: data.samples,
    });
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
  }

  async getMetricsById(id: string) {
    const timeSeries = await this.getById(id);

    return timeSeriesMetricsService.calculate(timeSeries.samples);
  }
}

export const timeSeriesService = new TimeSeriesService();