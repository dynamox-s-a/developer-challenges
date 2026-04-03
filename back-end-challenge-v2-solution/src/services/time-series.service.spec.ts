import AppError from "../errors/AppError.js";
import { TimeSeriesModel } from "../models/TimeSeries.js";
import { createTimeSeries } from "./time-series.service.js";

jest.mock("../models/TimeSeries");

const mockedModel = jest.mocked(TimeSeriesModel);

describe("TimeSeries Service", () => {
  const mockData = {
    seriesId: "S1",
    unit: "C",
    points: [{ timestamp: new Date(), value: 10 }],
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
});
