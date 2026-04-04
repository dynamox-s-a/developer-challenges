import AppError from "../errors/app-error.js";
import { TimeSeriesModel } from "../models/time-series.model.js";
import {
  countTimeSeries,
  createTimeSeries,
  deleteBySeriesId,
  getBySeriesId,
  getMetricsBySeriesId,
} from "./time-series.service.js";

jest.mock("../models/time-series.model");
const mockedModel = jest.mocked(TimeSeriesModel);

describe("TimeSeries Service", () => {
  const createPayload = {
    series_id: "S1",
    unit: "C",
    points: [
      { timestamp: new Date("2024-01-01T00:00:00.000Z"), value: 10 },
      { timestamp: new Date("2024-01-02T00:00:00.000Z"), value: 30 },
      { timestamp: new Date("2024-01-03T00:00:00.000Z"), value: 20 },
    ],
  };

  const storedSeries = {
    seriesId: "S1",
    unit: "C",
    points: [
      { timestamp: new Date("2024-01-01T00:00:00.000Z"), value: 10 },
      { timestamp: new Date("2024-01-02T00:00:00.000Z"), value: 30 },
      { timestamp: new Date("2024-01-03T00:00:00.000Z"), value: 20 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new time series", async () => {
    mockedModel.findOne.mockResolvedValue(null);
    mockedModel.create.mockResolvedValue(storedSeries as any);

    const result = await createTimeSeries(createPayload);

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
    expect(mockedModel.create).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
      unit: createPayload.unit,
      points: createPayload.points,
    });
    expect(result).toEqual(storedSeries);
  });

  it("should throw if time series already exists", async () => {
    mockedModel.findOne.mockResolvedValue(storedSeries as any);

    const promise = createTimeSeries(createPayload);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${createPayload.series_id} already exists.`,
      statusCode: 409,
    });

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
    expect(mockedModel.create).not.toHaveBeenCalled();
  });

  it("should return the total number of time series", async () => {
    mockedModel.countDocuments.mockResolvedValue(5);

    const result = await countTimeSeries();

    expect(mockedModel.countDocuments).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it("should return a time series by seriesId", async () => {
    mockedModel.findOne.mockResolvedValue(storedSeries as any);

    const result = await getBySeriesId(createPayload.series_id);

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
    expect(result).toEqual(storedSeries);
  });

  it("should throw if the time series does not exist", async () => {
    mockedModel.findOne.mockResolvedValue(null);

    const promise = getBySeriesId(createPayload.series_id);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${createPayload.series_id} not found.`,
      statusCode: 404,
    });

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
  });

  it("should return metrics for an existing time series", async () => {
    mockedModel.findOne.mockResolvedValue(storedSeries as any);

    const result = await getMetricsBySeriesId(createPayload.series_id);

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
    expect(result).toEqual({
      seriesId: "S1",
      unit: "C",
      totalPoints: 3,
      minValue: 10,
      maxValue: 30,
      averageValue: 20,
      firstTimestamp: new Date("2024-01-01T00:00:00.000Z"),
      lastTimestamp: new Date("2024-01-03T00:00:00.000Z"),
    });
  });

  it("should throw if the time series for metrics does not exist", async () => {
    mockedModel.findOne.mockResolvedValue(null);

    const promise = getMetricsBySeriesId(createPayload.series_id);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${createPayload.series_id} not found.`,
      statusCode: 404,
    });

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
  });

  it("should delete an existing time series", async () => {
    mockedModel.findOneAndDelete.mockResolvedValue(storedSeries as any);

    await deleteBySeriesId(createPayload.series_id);

    expect(mockedModel.findOneAndDelete).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
  });

  it("should throw if the time series to delete does not exist", async () => {
    mockedModel.findOneAndDelete.mockResolvedValue(null);

    const promise = deleteBySeriesId(createPayload.series_id);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${createPayload.series_id} not found.`,
      statusCode: 404,
    });

    expect(mockedModel.findOneAndDelete).toHaveBeenCalledWith({
      seriesId: createPayload.series_id,
    });
  });
});
