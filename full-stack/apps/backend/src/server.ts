import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { machinesRoutes } from "./routes/machines.js";
import { monitoringPointsRoutes } from "./routes/monitoringPoints.js";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });
await app.register(sensible);

app.get("/health", async () => ({ ok: true }));

await app.register(swagger, {
  openapi: {
    info: {
      title: "Dynamox Full Stack Challenge API",
      version: "0.1.0",
    },
  },
});

await app.register(swaggerUI, {
  routePrefix: "/docs",
});

await app.register(machinesRoutes);
await app.register(monitoringPointsRoutes);

app.listen({ port: 3001, host: "0.0.0.0" });