import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITimeSeriesRepository, MetricSeries } from '../../domain/repositories/time-series.repository';
import { TimeSeries } from '../../domain/entities/time-series.entity';
import { TimeSeriesSchemaClass, TimeSeriesDocument } from './schemas/time-series.schema';
import { SignalProcessingService } from '../../domain/services/signal-processing.service';
import { SensorName } from '../../domain/value-objects/sensor-name.vo';
import { Timestamp } from '../../domain/value-objects/timestamp.vo';
import { MeasurementUnit } from '../../domain/value-objects/measurement-unit.vo';

@Injectable()
export class MongoTimeSeriesRepository implements ITimeSeriesRepository {
  constructor(
    @InjectModel(TimeSeriesSchemaClass.name) private readonly model: Model<TimeSeriesDocument>,
    private readonly signalProcessor: SignalProcessingService
  ) {}

  async save(timeSeries: TimeSeries): Promise<string> {
    const metadata = {
      sensorId: timeSeries.sensorId,
      name: timeSeries.name.value,
      sampleRate: timeSeries.sampleRate,
      unit: timeSeries.unit.value,
    };

    const documents = timeSeries.data.map(point => ({
      datetime: new Date(point.datetime.value),
      metadata,
      value: point.value,
    }));

    await this.model.insertMany(documents);
    return timeSeries.sensorId;
  }

  async getMetrics(id: string): Promise<MetricSeries[]> {
    const aggResult = await this.model.aggregate([
      { $match: { 'metadata.sensorId': id } },
      {
        $group: {
          _id: {
             name: '$metadata.name',
             // Grouping by a 4-hour window for demonstration as per sample output spacing
             year: { $year: '$datetime' },
             month: { $month: '$datetime' },
             day: { $dayOfMonth: '$datetime' },
             hour: { $subtract: [{ $hour: '$datetime' }, { $mod: [{ $hour: '$datetime' }, 4] }] }
          },
          values: { $push: '$value' },
          firstTime: { $min: '$datetime' }
        }
      },
      { $sort: { 'firstTime': 1 } }
    ]);

    if (!aggResult || aggResult.length === 0) return [];

    const mapByName = new Map<string, any[]>();

    for (const group of aggResult) {
      const name = group._id.name;
      const values = group.values;
      const datetime = group.firstTime.toISOString();

      if (!mapByName.has(name)) {
        mapByName.set(name, []);
      }

      mapByName.get(name)!.push({
        datetime,
        max: this.signalProcessor.calculateMax(values),
        rms: this.signalProcessor.calculateRms(values),
        kurtosis: this.signalProcessor.calculateKurtosis(values),
        skewness: this.signalProcessor.calculateSkewness(values)
      });
    }

    const result: MetricSeries[] = [];
    for (const [name, data] of mapByName.entries()) {
      result.push({ name, data });
    }

    return result;
  }

  async count(): Promise<number> {
    // In MongoDB time series, counting documents is extremely fast. We can count unique series logic or raw points.
    // The metric implies count of stored signals. We can count distinct sensorIds.
    const distinctIds = await this.model.distinct('metadata.sensorId').exec();
    return distinctIds.length;
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteMany({ 'metadata.sensorId': id }).exec();
  }

  async getById(id: string): Promise<TimeSeries | null> {
    const docs = await this.model.find({ 'metadata.sensorId': id }).sort({ datetime: 1 }).exec();
    if (!docs || docs.length === 0) return null;

    const metadata = docs[0].metadata;
    const name = new SensorName(metadata.name);
    const tsUnit = new MeasurementUnit(metadata.unit);

    return new TimeSeries(
      name,
      metadata.sensorId,
      metadata.sampleRate,
      tsUnit,
      docs.map(d => ({
        datetime: new Timestamp(d.datetime.toISOString()),
        value: d.value
      }))
    );
  }
}
