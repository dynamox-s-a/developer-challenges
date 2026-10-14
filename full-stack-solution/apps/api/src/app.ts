import express, { type Express, type Router } from "express";
import cors from "cors";
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middlewares/error-handler";

export interface AppOptions {
  allowedOrigins?: string[];
}

export interface AppRouters {
  auth: Router;
  machines: Router;
  monitoringPoints: Router;
  timeSeries: Router;
}

/** How long a browser may cache a preflight, saving a round trip per route. */
const PREFLIGHT_CACHE_SECONDS = 86_400;

const READINGS_BODY_LIMIT = "1mb";
const READINGS_PATH = "/api/monitoring-points/:id/readings";

export function createApp(
  routers: Partial<AppRouters>,
  { allowedOrigins = [] }: AppOptions = {},
): Express {
  const app = express();
  app.disable("x-powered-by");

  if (allowedOrigins.length > 0) {
    app.use(
      cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        maxAge: PREFLIGHT_CACHE_SECONDS,
      }),
    );
  }

  app.use(READINGS_PATH, express.json({ limit: READINGS_BODY_LIMIT }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  if (routers.auth) app.use("/api/auth", routers.auth);
  if (routers.machines) app.use("/api/machines", routers.machines);
  if (routers.monitoringPoints) app.use("/api", routers.monitoringPoints);
  if (routers.timeSeries) app.use("/api", routers.timeSeries);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
