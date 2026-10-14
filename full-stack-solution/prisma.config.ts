import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "apps/api/prisma/schema.prisma",
  migrations: {
    path: "apps/api/prisma/migrations",
    seed: "tsx apps/api/prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
