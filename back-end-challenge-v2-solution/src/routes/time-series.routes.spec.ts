import request from "supertest";
import app from "../app.js";
import { TimeSeriesModel } from "../models/time-series.model.js";

jest.mock("../models/time-series.model.js");
const mockedModel = jest.mocked(TimeSeriesModel);

describe("POST /api/series", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if points array is empty (Zod validation)", async () => {
    const response = await request(app).post("/api/series").send({
      seriesId: "S1",
      unit: "C",
      points: [],
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should return 400 if points contain duplicated timestamps", async () => {
    const response = await request(app)
      .post("/api/series")
      .send({
        series_id: "S1",
        unit: "C",
        points: [
          { timestamp: "2024-01-01T00:00:00.000Z", value: 10 },
          { timestamp: "2024-01-01T00:00:00.000Z", value: 20 },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "points.1.timestamp",
          message: "timestamp must be unique within the same series",
        }),
      ]),
    );
  });

  it("should return 400 if points exceed the maximum supported size", async () => {
    const points = Array.from({ length: 2001 }, (_, index) => ({
      timestamp: new Date(Date.UTC(2024, 0, 1, 0, 0, index)).toISOString(),
      value: index,
    }));

    const response = await request(app).post("/api/series").send({
      series_id: "S1",
      unit: "C",
      points,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "points",
          message: "points must contain at most 2000 items",
        }),
      ]),
    );
  });

  it("should return 201 on success", async () => {
    const validData = {
      _id: "mongo-id",
      __v: 0,
      seriesId: "S1",
      unit: "C",
      createdAt: new Date("2026-04-04T16:16:11.845Z"),
      points: [{ timestamp: new Date("2024-01-01T00:00:00.000Z"), value: 10 }],
    };

    mockedModel.findOne.mockResolvedValue(null);
    mockedModel.create.mockResolvedValue(validData as any);

    const response = await request(app)
      .post("/api/series")
      .send({
        series_id: "S1",
        unit: "C",
        points: [{ timestamp: "2024-01-01T00:00:00.000Z", value: 10 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      series_id: "S1",
      created_at: "2026-04-04T16:16:11.845Z",
    });
    expect(response.body._id).toBeUndefined();
    expect(response.body.__v).toBeUndefined();
  });
});

describe("GET /api/series/count", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the total number of time series", async () => {
    mockedModel.countDocuments.mockResolvedValue(5);

    const response = await request(app).get("/api/series/count");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ total_series: 5 });
  });
});

describe("GET /api/series/:series_id", () => {
  const mockSeries = {
    _id: "mongo-id",
    __v: 0,
    seriesId: "S1",
    unit: "C",
    createdAt: new Date("2026-04-04T16:16:11.845Z"),
    points: [{ timestamp: new Date("2024-01-01T00:00:00.000Z"), value: 25 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the series data if it exists", async () => {
    mockedModel.findOne.mockResolvedValue(mockSeries as any);

    const response = await request(app).get("/api/series/S1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      series_id: "S1",
      unit: "C",
      points: [{ timestamp: "2024-01-01T00:00:00.000Z", value: 25 }],
      created_at: "2026-04-04T16:16:11.845Z",
    });
    expect(response.body._id).toBeUndefined();
    expect(response.body.__v).toBeUndefined();
    expect(mockedModel.findOne).toHaveBeenCalledWith({ seriesId: "S1" });
  });

  it("should return 404 if the series does not exist", async () => {
    mockedModel.findOne.mockResolvedValue(null);

    const response = await request(app).get("/api/series/ID-INEXISTENTE");

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("not found");
  });

  it("should return 400 if seriesId is invalid/empty", async () => {
    const response = await request(app).get("/api/series/%20");

    expect(response.status).toBe(400);
  });
});

describe("GET /api/series/:series_id/metrics", () => {
  const mockSeries = {
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

  it("should return 200 and the metrics if the series exists", async () => {
    mockedModel.findOne.mockResolvedValue(mockSeries as any);

    const response = await request(app).get("/api/series/S1/metrics");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      series_id: "S1",
      unit: "C",
      total_points: 3,
      min_value: 10,
      max_value: 30,
      average_value: 20,
      first_timestamp: "2024-01-01T00:00:00.000Z",
      last_timestamp: "2024-01-03T00:00:00.000Z",
    });
    expect(mockedModel.findOne).toHaveBeenCalledWith({
      seriesId: "S1",
    });
  });

  it("should return 404 if the series for metrics does not exist", async () => {
    mockedModel.findOne.mockResolvedValue(null);

    const response = await request(app).get(
      "/api/series/ID-INEXISTENTE/metrics",
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("not found");
  });

  it("should return 400 if seriesId for metrics is invalid/empty", async () => {
    const response = await request(app).get("/api/series/%20/metrics");

    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/series/:series_id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 204 if the series is deleted", async () => {
    mockedModel.findOneAndDelete.mockResolvedValue({ seriesId: "S1" } as any);

    const response = await request(app).delete("/api/series/S1");

    expect(response.status).toBe(204);
    expect(mockedModel.findOneAndDelete).toHaveBeenCalledWith({
      seriesId: "S1",
    });
  });

  it("should return 404 if the series does not exist", async () => {
    mockedModel.findOneAndDelete.mockResolvedValue(null);

    const response = await request(app).delete("/api/series/ID-INEXISTENTE");

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("not found");
  });

  it("should return 400 if seriesId is invalid/empty", async () => {
    const response = await request(app).delete("/api/series/%20");

    expect(response.status).toBe(400);
  });
});
