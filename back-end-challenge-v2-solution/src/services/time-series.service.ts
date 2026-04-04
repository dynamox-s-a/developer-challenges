import { CreateTimeSeriesDto } from "../dto/time-series.dto.js";
import AppError from "../errors/AppError.js";
import { TimeSeries, TimeSeriesModel } from "../models/time-series.model.js";
import { TimeSeriesMetrics } from "../models/time-series.types.js";

export async function createTimeSeries({
  seriesId,
  unit,
  points,
}: CreateTimeSeriesDto): Promise<TimeSeries> {
  const existing = await TimeSeriesModel.findOne({ seriesId });

  if (existing) {
    throw new AppError(`Time series with ID ${seriesId} already exists.`, 409);
  }

  const series = await TimeSeriesModel.create({ seriesId, unit, points });

  return series;
}

export async function countTimeSeries(): Promise<number> {
  return await TimeSeriesModel.countDocuments();
}

export async function getBySeriesId(seriesId: string): Promise<TimeSeries> {
  const series = await TimeSeriesModel.findOne({ seriesId });

  if (!series) {
    throw new AppError(`Time series with ID ${seriesId} not found.`, 404);
  }

  return series;
}

export async function getMetricsBySeriesId(
  seriesId: string,
): Promise<TimeSeriesMetrics> {
  const series = await getBySeriesId(seriesId);
  const values = series.points.map((point) => point.value);
  const timestamps = series.points.map((point) => point.timestamp.getTime());
  const sum = values.reduce((total, value) => total + value, 0);

  return {
    seriesId: series.seriesId,
    unit: series.unit,
    totalPoints: values.length,
    minValue: Math.min(...values),
    maxValue: Math.max(...values),
    averageValue: sum / values.length,
    firstTimestamp: new Date(Math.min(...timestamps)),
    lastTimestamp: new Date(Math.max(...timestamps)),
  };
}

export async function deleteBySeriesId(seriesId: string): Promise<void> {
  const deletedSeries = await TimeSeriesModel.findOneAndDelete({ seriesId });

  if (!deletedSeries) {
    throw new AppError(`Time series with ID ${seriesId} not found.`, 404);
  }
}
