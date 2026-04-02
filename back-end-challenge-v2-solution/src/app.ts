import express, { Application } from "express";
import { getStatusDB } from "./config/database.js";

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

export default app;
