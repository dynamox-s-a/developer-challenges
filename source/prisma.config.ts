import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'libs/shared/persistence/prisma/schema.prisma',
  migrations: {
    path: 'libs/shared/persistence/prisma/migrations',
    seed: 'tsx libs/shared/persistence/prisma/seed.ts',
  },
  datasource: {
    // using process.env here as typically env() helper might need context
    url: process.env.DATABASE_URL,
  },
});
