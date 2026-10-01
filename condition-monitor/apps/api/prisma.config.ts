import { join } from 'node:path';
import { defineConfig, env } from 'prisma/config';
import { loadEnvFile } from './src/config/load-env-file';

// Prisma 7 no longer reads .env on its own; the workspace keeps one at its root.
loadEnvFile(join(import.meta.dirname, '../../.env'));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'node dist/seed.js' },
  datasource: { url: env('DATABASE_URL') },
});
