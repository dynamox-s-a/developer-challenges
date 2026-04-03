import request from "supertest";
import app from "../app.js";
import { TimeSeriesModel } from "../models/TimeSeries.js";

jest.mock("../models/TimeSeries.js");
const mockedModel = jest.mocked(TimeSeriesModel);

describe("POST /api/series", () => {
  it("should return 400 if points array is empty (Zod validation)", async () => {
    const response = await request(app).post("/api/series").send({
      seriesId: "S1",
      unit: "C",
      points: [],
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  it("should return 201 on success", async () => {
    const validData = {
      seriesId: "S1",
      unit: "C",
      points: [{ timestamp: new Date().toISOString(), value: 10 }],
    };

    mockedModel.findOne.mockResolvedValue(null);
    mockedModel.create.mockResolvedValue(validData as any);

    const response = await request(app).post("/api/series").send(validData);

    expect(response.status).toBe(201);
    expect(response.body.seriesId).toBe("S1");
  });
});

describe("GET /api/series/count", () => {
  it("should return the total number of time series", async () => {
    mockedModel.countDocuments.mockResolvedValue(5);

    const response = await request(app).get("/api/series/count");

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(5);
  });
});
