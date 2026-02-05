// 1. Adicione esta linha no topo!
import 'dotenv/config'; 
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Agora o env('DATABASE_URL') vai funcionar porque o dotenv carregou o arquivo antes
    url: env("DATABASE_URL"),
  },
});