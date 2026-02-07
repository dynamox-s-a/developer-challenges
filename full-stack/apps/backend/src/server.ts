import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";

import { machinesRoutes } from "./routes/machines.js";
import { monitoringPointsRoutes } from "./routes/monitoringPoints.js";
import { authRoutes } from "./routes/auth.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(sensible);

await app.register(swagger, {
  openapi: {
    info: { title: "Dynamox Full Stack Challenge API", version: "0.1.0" },
  },
});
await app.register(swaggerUI, { routePrefix: "/docs" });

await app.register(jwt, {
  secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
});

app.decorate("authenticate", async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
});

app.get("/health", async () => ({ ok: true }));
await app.register(authRoutes);

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

await app.register(machinesRoutes);
await app.register(monitoringPointsRoutes);

app.listen({ port: 3001, host: "0.0.0.0" });