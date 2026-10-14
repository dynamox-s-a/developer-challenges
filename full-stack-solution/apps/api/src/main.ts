import { createApp } from "./app";
import { loadEnv } from "./config/env";
import { createRouters } from "./container";
import { createPrismaClient } from "./database/prisma";

const env = loadEnv();
const prisma = createPrismaClient(env.DATABASE_URL);
const app = createApp(createRouters(env, prisma), {
  allowedOrigins: env.CORS_ALLOWED_ORIGINS,
});

const server = app.listen(env.PORT, (error?: Error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`API listening on http://localhost:${env.PORT}/api`);
});

async function shutdown(): Promise<void> {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
