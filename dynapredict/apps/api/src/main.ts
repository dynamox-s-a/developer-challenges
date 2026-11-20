#!/usr/bin/env node
// @nx-target-name: serve
import { app } from './app.ts';
import { env } from './config/env.ts';

const server = app.listen(env.PORT, env.HOST, async (error?: Error) => {
  if (error) {
    throw error;
  }
  console.log(`[ ready ] http://${env.HOST}:${env.PORT}`);
  // Set when Nx waits for this server to be ready
  if (process.env.NX_READY_SIGNAL_SOCKET) {
    try {
      // Function keeps TypeScript and bundlers from rewriting or bundling the import
      const load = new Function('s', 'return import(s)') as (
        s: string,
      ) => Promise<{ emitReadySignal(server: unknown): boolean }>;
      (await load('@nx/js/ready-signal')).emitReadySignal(server);
    } catch {
      // @nx/js isn't installed
    }
  }
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});