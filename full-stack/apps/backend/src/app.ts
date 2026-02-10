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

  app.get("/health", async () => {
    const hostname = require('os').hostname();
    const pid = process.pid;
    return { 
      ok: true, 
      server: `${hostname}-${pid}`,
      timestamp: new Date().toISOString()
    };
  });
  app.register(authRoutes);
  app.register(machinesRoutes);
  app.register(monitoringPointsRoutes);
  app.register(timeSeriesRoutes);

  return app;
}
