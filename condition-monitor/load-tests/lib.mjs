// Helpers shared by the load test scripts. They run from the workspace root, with the
// production build of the API against a database of its own, so the development and
// test databases are never touched (docs/performance.md).
import { execFileSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile('.env');

export const LOAD_DATABASE = 'condition_monitor_load';
export const LOAD_PORT = 3100;
export const LOAD_API = `http://localhost:${LOAD_PORT}/api`;

const user = process.env.POSTGRES_USER ?? 'condition_monitor';
const password = process.env.POSTGRES_PASSWORD ?? 'condition_monitor';
const port = process.env.POSTGRES_PORT ?? '5432';
export const LOAD_DATABASE_URL = `postgresql://${user}:${password}@localhost:${port}/${LOAD_DATABASE}`;

/** The environment of every process that must use the load database, never the others. */
export const loadEnv = {
  ...process.env,
  DATABASE_URL: LOAD_DATABASE_URL,
  PORT: String(LOAD_PORT),
  NODE_ENV: 'production',
};

export function log(message) {
  process.stdout.write(`[${new Date().toISOString().slice(11, 19)}] ${message}\n`);
}

export function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: 'inherit', env: loadEnv, ...options });
}

/**
 * Runs SQL as the database owner, inside the PostgreSQL container of docker-compose.yml:
 * on the maintenance database by default, or on the one given.
 */
export function psql(sql, database = 'postgres') {
  run('docker', [
    'compose',
    'exec',
    '-T',
    'postgres',
    'psql',
    '-U',
    user,
    '-d',
    database,
    '-v',
    'ON_ERROR_STOP=1',
    '-c',
    sql,
  ]);
}

/** Starts the built API on the load port and waits until its health check answers. */
export async function startApi() {
  const api = spawn('node', ['apps/api/dist/main.js'], {
    env: loadEnv,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${LOAD_API}/health`);
      if (response.ok) return api;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  api.kill();
  throw new Error(`The API did not answer on port ${LOAD_PORT} within 30 s. Is the port free?`);
}

export function stopApi(api) {
  return new Promise((resolve) => {
    api.once('exit', resolve);
    api.kill('SIGTERM');
  });
}

/** Logs in as the seed user and returns a function that sends the session cookie. */
export async function login() {
  const response = await fetch(`${LOAD_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SEED_USER_EMAIL,
      password: process.env.SEED_USER_PASSWORD,
    }),
  });
  const cookie = response.headers.getSetCookie()[0]?.split(';')[0];
  if (response.status !== 204 || !cookie) {
    throw new Error(`Login as ${process.env.SEED_USER_EMAIL} failed with ${response.status}.`);
  }
  const send = (method, path, body) =>
    fetch(`${LOAD_API}${path}`, {
      method,
      headers: { Cookie: cookie, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  return async (method, path, body) => {
    let answer;
    try {
      answer = await send(method, path, body);
    } catch (error) {
      // After minutes idle, as during a backfill, the server has closed the kept-alive
      // connection fetch reuses. A read changes nothing, so it is safe to send again.
      if (method !== 'GET') throw error;
      answer = await send(method, path, body);
    }
    if (!answer.ok)
      throw new Error(`${method} ${path} answered ${answer.status}: ${await answer.text()}`);
    return answer.status === 204 ? null : answer.json();
  };
}
