function getDatabaseNameFromUrl(databaseUrl: string) {
  const parsed = new URL(databaseUrl)
  return parsed.pathname.replace(/^\//, '')
}

export function assertSafeTestDatabase(databaseUrl: string | undefined) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  const dbName = getDatabaseNameFromUrl(databaseUrl)
  if (!dbName) {
    throw new Error('DATABASE_URL must include a database name')
  }

  const looksLikeTestDb = /(^test$|_test$|test_|test)/i.test(dbName)
  if (!looksLikeTestDb) {
    throw new Error(
      `Unsafe test database "${dbName}". Refusing to run destructive test operations. Use a dedicated *_test database.`
    )
  }

  return dbName
}
