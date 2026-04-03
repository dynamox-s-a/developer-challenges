import express, { Application } from "express";
import { getStatusDB } from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import AppError from "./errors/AppError.js";

const app: Application = express();

app.use(express.json());

app.get("/health", async (_req, res) => {
  const mongoStatus = await getStatusDB();
  res.json({
    status: "ok",
    mongo: mongoStatus,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});

app.use(errorHandler);

export default app;
