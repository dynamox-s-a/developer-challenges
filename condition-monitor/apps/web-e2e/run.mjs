// Runs the end-to-end tests against a running application built for production: the API
// and the web app, each on a port of its own, over a database of their own that is
// recreated here. The development and test databases are never touched.
//
// Usage, from the workspace root: npm run e2e
//
// The database is administered with a Postgres client, not `docker compose`, so this
// works the same locally and in CI, where Postgres is a service, not a Compose project.
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import bcrypt from 'bcrypt';
import { Client } from 'pg';

if (existsSync('.env')) process.loadEnvFile('.env');

const DATABASE = 'condition_monitor_e2e';
const API_PORT = 3300;
const WEB_PORT = 4400;

const pgUser = process.env.POSTGRES_USER ?? 'condition_monitor';
const pgPassword = process.env.POSTGRES_PASSWORD ?? 'condition_monitor';
const pgPort = process.env.POSTGRES_PORT ?? '5432';
const base = `postgresql://${pgUser}:${pgPassword}@localhost:${pgPort}`;
const DATABASE_URL = `${base}/${DATABASE}`;

// The two accounts the tests use. The first owns the seeded DRY sector; the second lets
// the tests prove that one user cannot reach another's data (assumption A4).
const accounts = {
  user1: {
    email: process.env.SEED_USER_EMAIL ?? 'operator@condition-monitor.test',
    password: process.env.SEED_USER_PASSWORD ?? 'Monitor-2026-dev',
  },
  user2: {
    email: process.env.E2E_USER2_EMAIL ?? 'inspector@condition-monitor.test',
    password: process.env.E2E_USER2_PASSWORD ?? 'Inspector-2026-dev',
  },
};

function log(message) {
  process.stdout.write(`[e2e] ${message}\n`);
}

function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

async function onDatabase(connection, work) {
  const client = new Client({ connectionString: connection });
  await client.connect();
  try {
    return await work(client);
  } finally {
    await client.end();
  }
}

/** The API serves the cookie without the Secure flag, so the browser keeps it over HTTP. */
const apiEnv = {
  ...process.env,
  DATABASE_URL,
  PORT: String(API_PORT),
  NODE_ENV: 'e2e',
};

async function startServer(name, command, args, options, ready) {
  // Its own process group, so stopping it also stops the children it forks, such as the
  // real server behind an `npx` wrapper.
  const server = spawn(command, args, {
    env: { ...process.env, ...options.env },
    stdio: ['ignore', 'ignore', 'inherit'],
    detached: true,
    ...options.spawn,
  });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(ready)).ok) return server;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  server.kill();
  throw new Error(`${name} did not answer at ${ready} within 60 s.`);
}

const servers = [];
function stopAll() {
  for (const server of servers) {
    try {
      // Negative pid: the whole process group started with `detached`.
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      // Already gone.
    }
  }
}

async function main() {
  const hashes = {
    user1: bcrypt.hashSync(accounts.user1.password, 10),
    user2: bcrypt.hashSync(accounts.user2.password, 10),
  };

  log(`Recreating the database ${DATABASE}.`);
  await onDatabase(`${base}/postgres`, async (client) => {
    await client.query(`DROP DATABASE IF EXISTS ${DATABASE} WITH (FORCE)`);
    await client.query(`CREATE DATABASE ${DATABASE}`);
  });

  log('Building the API and the web app for production.');
  run('npx', ['nx', 'run-many', '-t', 'build', '-p', 'api', 'web', '--configuration=production']);
  run('npx', ['prisma', 'migrate', 'deploy'], {
    cwd: 'apps/api',
    env: { ...process.env, DATABASE_URL },
  });

  // An initial seed so `cypress open` has data; every test resets to the same state.
  await onDatabase(DATABASE_URL, async (client) => {
    const first = await client.query(
      `INSERT INTO users (email, password_hash, updated_at) VALUES ($1, $2, now()) RETURNING id`,
      [accounts.user1.email, hashes.user1],
    );
    await client.query(
      `INSERT INTO users (email, password_hash, updated_at) VALUES ($1, $2, now())`,
      [accounts.user2.email, hashes.user2],
    );
    await client.query(
      `INSERT INTO sectors (owner_id, code, name, updated_at) VALUES ($1, 'DRY', 'Drying section', now())`,
      [first.rows[0].id],
    );
  });

  log(`Starting the API on ${API_PORT} and the web app on ${WEB_PORT}.`);
  servers.push(
    await startServer(
      'API',
      'node',
      ['apps/api/dist/main.js'],
      { env: apiEnv },
      `http://localhost:${API_PORT}/api/health`,
    ),
  );
  servers.push(
    await startServer(
      'web app',
      'npx',
      ['vite', 'preview', '--port', String(WEB_PORT), '--strictPort'],
      { env: { API_URL: `http://localhost:${API_PORT}` }, spawn: { cwd: 'apps/web' } },
      `http://localhost:${WEB_PORT}/api/health`,
    ),
  );

  log('Running Cypress.');
  const result = spawnSync('npx', ['cypress', 'run', '--project', 'apps/web-e2e'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      E2E_DATABASE_URL: DATABASE_URL,
      // Through the web origin's proxy, so the session cookie is stored for the origin the
      // browser uses, shared by cy.request, window.fetch and the app alike.
      E2E_API_URL: `http://localhost:${WEB_PORT}/api`,
      E2E_WEB_URL: `http://localhost:${WEB_PORT}`,
      SEED_USER_EMAIL: accounts.user1.email,
      SEED_USER_PASSWORD: accounts.user1.password,
      E2E_USER1_HASH: hashes.user1,
      E2E_USER2_EMAIL: accounts.user2.email,
      E2E_USER2_PASSWORD: accounts.user2.password,
      E2E_USER2_HASH: hashes.user2,
    },
  });
  return result.status ?? 1;
}

main()
  .then((code) => {
    stopAll();
    process.exitCode = code;
  })
  .catch((error) => {
    stopAll();
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
