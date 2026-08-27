#!/usr/bin/env node
/**
 * Load + LB distribution checks.
 *
 * Usage:
 *   node scripts/load/run-load.mjs
 *   LOAD_BASE_URL=http://localhost:8080 node scripts/load/run-load.mjs
 */

import autocannon from 'autocannon';

const baseUrl = process.env.LOAD_BASE_URL ?? 'http://localhost:3001';
const connections = Number(process.env.LOAD_CONNECTIONS ?? 20);
const duration = Number(process.env.LOAD_DURATION ?? 10);
const samples = Number(process.env.LOAD_SAMPLES ?? 40);

function percentile(latency, key, fallbackKeys = []) {
  for (const k of [key, ...fallbackKeys]) {
    const value = latency?.[k];
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }
  }
  return undefined;
}

function printResult(title, result, { checkLatencyTarget = true } = {}) {
  const latency = result.latency;
  const requests = result.requests;
  const p50 = percentile(latency, 'p50');
  // autocannon reports p90 / p97_5; approximate p95 with p97_5 when present
  const p95 = percentile(latency, 'p95', ['p97_5', 'p90']);
  const p99 = percentile(latency, 'p99');
  console.log(`\n=== ${title} ===`);
  console.log(`URL: ${result.url}`);
  console.log(`Requests/sec (avg): ${requests.average}`);
  console.log(`Latency p50: ${p50}ms | ~p95: ${p95}ms | p99: ${p99}ms`);
  console.log(`Errors: ${result.errors} | Timeouts: ${result.timeouts}`);
  console.log(`2xx: ${result['2xx'] ?? 0} | Non-2xx: ${result.non2xx}`);

  if (!checkLatencyTarget || typeof p95 !== 'number') {
    return;
  }
  if (p95 > 350) {
    console.warn(`WARN: ~p95 (${p95}ms) exceeds the 350ms challenge target.`);
  } else {
    console.log(`OK: ~p95 (${p95}ms) is within the 350ms target.`);
  }
}

async function runAutocannon(path, title) {
  const result = await autocannon({
    url: `${baseUrl}${path}`,
    connections,
    duration,
    headers: {
      Accept: 'application/json',
    },
  });
  printResult(title, result);
  return result;
}

async function checkInstanceDistribution(path) {
  const counts = new Map();

  for (let i = 0; i < samples; i++) {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
    });
    const instanceId = response.headers.get('x-instance-id') ?? 'unknown';
    counts.set(instanceId, (counts.get(instanceId) ?? 0) + 1);
  }

  console.log('\n=== LB instance distribution (X-Instance-Id) ===');
  console.log(`Samples: ${samples}`);
  for (const [id, count] of [...counts.entries()].sort()) {
    console.log(`  ${id}: ${count}`);
  }

  if (counts.size < 2) {
    console.warn(
      'WARN: Only one instance id observed. If you expected LB scaling, run with --scale api=2 behind the lb service.'
    );
  } else {
    console.log(`OK: Traffic reached ${counts.size} distinct API instances.`);
  }
}

async function main() {
  console.log(`Load base URL: ${baseUrl}`);
  console.log(`connections=${connections} duration=${duration}s samples=${samples}`);

  await runAutocannon('/health', 'GET /health');
  await checkInstanceDistribution('/health');

  // Authenticated smoke under load (login only — cheap write path)
  const loginResult = await autocannon({
    url: `${baseUrl}/api/auth/login`,
    method: 'POST',
    connections: Math.min(10, connections),
    duration: Math.min(5, duration),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@dynamox.test',
      password: 'Dynamox@123',
    }),
  });
  printResult('POST /api/auth/login (bcrypt-bound; latency target N/A)', loginResult, {
    checkLatencyTarget: false,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
