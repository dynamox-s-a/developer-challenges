import { CreateTimeSeriesDto } from "../dto/time-series.dto.js";
import AppError from "../errors/AppError.js";
import { TimeSeries, TimeSeriesModel } from "../models/TimeSeries.js";

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

export async function countTimeSeries(): Promise<Number> {
  return await TimeSeriesModel.countDocuments();
}

export async function getBySeriesId(seriesId: string): Promise<TimeSeries> {
  const series = await TimeSeriesModel.findOne({ seriesId });

  if (!series) {
    throw new AppError(`Time series with ID ${seriesId} not found.`, 404);
  }

  return series;
}

export async function deleteBySeriesId(seriesId: string): Promise<void> {
  const deletedSeries = await TimeSeriesModel.findOneAndDelete({ seriesId });

  if (!deletedSeries) {
    throw new AppError(`Time series with ID ${seriesId} not found.`, 404);
  }
}
