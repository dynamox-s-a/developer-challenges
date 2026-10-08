// Importing env first validates the environment, so a misconfigured API
// exits at boot instead of failing on the first request.
import { env } from './config/env';
import { createApp } from './app';
import { prisma } from './lib/prisma';

const server = createApp().listen(env.PORT, () => {
  console.log(
    `Dynapredict API listening on port ${env.PORT} (${env.NODE_ENV})`,
  );
});

// Render and docker stop containers with SIGTERM: finish in-flight requests,
// then release the database pool.
function shutdown(signal: NodeJS.Signals) {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
