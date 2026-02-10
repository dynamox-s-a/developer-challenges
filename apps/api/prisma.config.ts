import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'dotenv -e ../../.env -- ts-node prisma/seed.ts'
  },
  datasource: {
    url: env('DATABASE_URL')
  }
})
