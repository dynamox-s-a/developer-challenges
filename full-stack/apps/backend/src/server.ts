import Fastify from "fastify";
import cors from "@fastify/cors";
import { prisma } from "./prisma.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

app.get("/health", async () => {
  await prisma.healthCheck.create({ data: {} });
  const count = await prisma.healthCheck.count();
  return { ok: true, healthChecks: count };
});

app.listen({ port: 3001, host: "0.0.0.0" });