import { createDatabase } from "@dyn/database";
import { serve } from "@hono/node-server";

import { createApp } from "./app.js";
import { createAppRepository, createServices } from "./dependencies.js";
import { parseEnv } from "./env.js";
import { createAuthService } from "./modules/auth.js";

const env = parseEnv();
const database = createDatabase(env.DATABASE_URL);
const repository = createAppRepository(database.db);
const services = createServices(repository);
const auth = createAuthService({
  repository,
  jwtSecret: env.JWT_SECRET,
  expiresInSeconds: env.JWT_EXPIRES_IN_SECONDS,
});
const app = createApp({ repository, services, auth });

// The challenge's fixed admin identity now lives in the users table like everyone else; seeding is
// idempotent because createUser rides the unique email index.
const seededAdmin = await repository.createUser({
  email: env.AUTH_EMAIL.toLowerCase(),
  passwordSalt: env.AUTH_PASSWORD_SALT,
  passwordHash: env.AUTH_PASSWORD_HASH,
});
if (seededAdmin) {
  console.info("auth.admin_seeded", { email: seededAdmin.email });
}

const server = serve({
  fetch: app.fetch,
  hostname: env.HOST,
  port: env.PORT,
});

console.info("server.started", {
  hostname: env.HOST,
  port: env.PORT,
});

let shuttingDown = false;

// server.close is callback-based, so wrap it to keep the shutdown sequence awaitable.
function closeServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.info("server.stopping", { signal });

  try {
    await closeServer();
  } catch (error) {
    console.error("server.close_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exitCode = 1;
  }

  await database.close();
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
