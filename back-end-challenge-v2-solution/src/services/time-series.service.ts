import { CreateTimeSeriesDto } from "../dto/time-series.dto.js";
import { TimeSeries, TimeSeriesModel } from "../models/TimeSeries.js";

export async function createTimeSeries({
  seriesId,
  unit,
  points,
}: CreateTimeSeriesDto): Promise<TimeSeries> {
  const existing = await TimeSeriesModel.findOne({ seriesId });

  if (existing) {
    throw new Error(`Time series with ID ${seriesId} already exists.`);
  }

  const series = await TimeSeriesModel.create({ seriesId, unit, points });

  return series;
}
