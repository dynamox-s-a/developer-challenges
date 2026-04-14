import { TimeSeriesModel } from '../models/timeSeries.model';
import { Sample } from '../types/timeSeries';

export class TimeSeriesRepository {
  async create(data: { name?: string; samples: Sample[] }) {
    return TimeSeriesModel.create({
      name: data.name,
      samples: data.samples,
    });
  }

  async findById(id: string) {
    return TimeSeriesModel.findById(id).lean();
  }

  async count() {
    return TimeSeriesModel.countDocuments();
  }

  async deleteById(id: string) {
    return TimeSeriesModel.findByIdAndDelete(id);
  }
}

export const timeSeriesRepository = new TimeSeriesRepository();