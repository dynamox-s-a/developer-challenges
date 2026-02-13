import { prisma } from '../../src/core/lib/prisma'
import { assertSafeTestDatabase } from './test-db-safety'

export async function truncateAll() {
  assertSafeTestDatabase(process.env.DATABASE_URL)

  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
  `

  if (tables.length === 0) return

  const tableNames = tables
    .map((row) => `"public"."${row.tablename}"`)
    .join(', ')

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`
  )
}

export async function dbReset() {
  await truncateAll()
}

export async function dbDisconnect() {
  await prisma.$disconnect()
}
