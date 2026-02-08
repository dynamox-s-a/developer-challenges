import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";

import { machinesRoutes } from "./routes/machines.js";
import { monitoringPointsRoutes } from "./routes/monitoringPoints.js";
import { authRoutes } from "./routes/auth.js";
import { timeSeriesRoutes } from "./routes/timeSeries.js";

export function buildApp() {
  const app = Fastify({ logger: false });

  app.register(cors, { origin: true });
  app.register(sensible);

  app.register(swagger, {
    openapi: {
      info: { title: "Dynamox Full Stack Challenge API", version: "0.1.0" },
    },
  });
  app.register(swaggerUI, { routePrefix: "/docs" });

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  });

  app.decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  });

  app.setErrorHandler((err: any, req, reply) => {
    req.log.error(err);

    const status = err.statusCode ?? 500;

    reply.status(status).send({
      error: status >= 500 ? "Internal Server Error" : err.name,
      message: err.message,
      statusCode: status,
    });
  });

  app.get("/health", async () => ({ ok: true }));
  app.register(authRoutes);

  app.addHook("onRequest", async (req, reply) => {
    const url = req.url;

    const isPublic =
      url === "/health" ||
      url === "/docs" ||
      url.startsWith("/docs/") ||
      url === "/auth/login";

    if (isPublic) return;

    await (app as any).authenticate(req, reply);

    if (reply.sent) return;
  });

  app.register(machinesRoutes);
  app.register(monitoringPointsRoutes);
  app.register(timeSeriesRoutes);

  return app;
}
