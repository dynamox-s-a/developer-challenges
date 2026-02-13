import { Client } from 'pg'

async function ensureTestDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  const target = new URL(databaseUrl)
  const dbName = target.pathname.replace(/^\//, '')

  if (!dbName) {
    throw new Error('DATABASE_URL must include a database name')
  }

  const adminUrl = new URL(databaseUrl)
  adminUrl.pathname = '/postgres'

  const client = new Client({ connectionString: adminUrl.toString() })

  await client.connect()

  const result = await client.query<{ exists: boolean }>(
    'SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) as "exists"',
    [dbName]
  )

  if (!result.rows[0]?.exists) {
    await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`)
  }

  await client.end()
}

ensureTestDatabase().catch((error) => {
  console.error(error)
  process.exit(1)
})
