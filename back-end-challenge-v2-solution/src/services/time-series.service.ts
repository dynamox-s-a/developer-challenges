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
