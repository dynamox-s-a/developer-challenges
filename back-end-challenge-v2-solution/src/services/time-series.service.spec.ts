import AppError from "../errors/AppError.js";
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
  const mockData = {
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
    mockedModel.create.mockResolvedValue(mockData as any);

    const result = await createTimeSeries(mockData);

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
    });
    expect(mockedModel.create).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });

  it("should throw if time series already exists", async () => {
    mockedModel.findOne.mockResolvedValue(mockData as any);

    const promise = createTimeSeries(mockData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${mockData.seriesId} already exists.`,
      statusCode: 409,
    });

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
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
    mockedModel.findOne.mockResolvedValue(mockData as any);

    const result = await getBySeriesId(mockData.seriesId);

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
    });
    expect(result).toEqual(mockData);
  });

  it("should throw if the time series does not exist", async () => {
    mockedModel.findOne.mockResolvedValue(null);

    const promise = getBySeriesId(mockData.seriesId);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${mockData.seriesId} not found.`,
      statusCode: 404,
    });

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
    });
  });

  it("should return metrics for an existing time series", async () => {
    mockedModel.findOne.mockResolvedValue(mockData as any);

    const result = await getMetricsBySeriesId(mockData.seriesId);

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
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

    const promise = getMetricsBySeriesId(mockData.seriesId);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${mockData.seriesId} not found.`,
      statusCode: 404,
    });

    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
    });
  });

  it("should delete an existing time series", async () => {
    mockedModel.findOneAndDelete.mockResolvedValue(mockData as any);

    await deleteBySeriesId(mockData.seriesId);

    expect(mockedModel.findOneAndDelete).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
    });
  });

  it("should throw if the time series to delete does not exist", async () => {
    mockedModel.findOneAndDelete.mockResolvedValue(null);

    const promise = deleteBySeriesId(mockData.seriesId);

    await expect(promise).rejects.toBeInstanceOf(AppError);
    await expect(promise).rejects.toMatchObject({
      message: `Time series with ID ${mockData.seriesId} not found.`,
      statusCode: 404,
    });

    expect(mockedModel.findOneAndDelete).toHaveBeenCalledWith({
      seriesId: mockData.seriesId,
    });
  });
});
