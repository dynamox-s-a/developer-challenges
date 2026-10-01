import { defineConfig } from 'cypress';
import { Client } from 'pg';

/**
 * End-to-end tests against a running application (the real web app, the API and a
 * database of their own), started by `apps/web-e2e/run.mjs`. The run script passes the
 * addresses and the two seeded accounts through the environment.
 */

const databaseUrl = process.env.E2E_DATABASE_URL ?? '';
const accounts = [
  {
    email: process.env.SEED_USER_EMAIL ?? 'operator@condition-monitor.test',
    passwordHash: process.env.E2E_USER1_HASH ?? '',
  },
  {
    email: process.env.E2E_USER2_EMAIL ?? 'inspector@condition-monitor.test',
    passwordHash: process.env.E2E_USER2_HASH ?? '',
  },
];

/**
 * Empties every application table and recreates the two users and the `DRY` sector, so
 * each test starts from a known state. The password hashes are computed once by the run
 * script, so a reset is a handful of fast inserts. The owner of `DRY` is the first user.
 */
async function resetDatabase(): Promise<null> {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const { rows } = await client.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`,
    );
    if (rows.length > 0) {
      const tables = rows.map((row) => `"${row.tablename}"`).join(', ');
      await client.query(`TRUNCATE ${tables} RESTART IDENTITY CASCADE`);
    }
    const ids: string[] = [];
    for (const account of accounts) {
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO users (email, password_hash, updated_at) VALUES ($1, $2, now()) RETURNING id`,
        [account.email, account.passwordHash],
      );
      ids.push(inserted.rows[0].id);
    }
    await client.query(
      `INSERT INTO sectors (owner_id, code, name, updated_at) VALUES ($1, 'DRY', 'Drying section', now())`,
      [ids[0]],
    );
  } finally {
    await client.end();
  }
  return null;
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.E2E_WEB_URL ?? 'http://localhost:4400',
    viewportWidth: 1280,
    viewportHeight: 800,
    specPattern: 'src/e2e/**/*.cy.ts',
    supportFile: 'src/support/e2e.ts',
    screenshotsFolder: 'screenshots',
    // Videos are heavy and add nothing a screenshot of the failure does not.
    video: false,
    // A flaky retry in CI, never when writing tests: a test that needs a retry to pass
    // is a test to fix.
    retries: { runMode: 1, openMode: 0 },
    env: {
      apiUrl: process.env.E2E_API_URL ?? 'http://localhost:3300/api',
      user1Email: accounts[0].email,
      user1Password: process.env.SEED_USER_PASSWORD ?? '',
      user2Email: accounts[1].email,
      user2Password: process.env.E2E_USER2_PASSWORD ?? '',
    },
    setupNodeEvents(on) {
      on('task', { 'db:reset': resetDatabase });
    },
  },
});
