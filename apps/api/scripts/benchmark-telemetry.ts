import autocannon from 'autocannon'

type ApiSuccess<T> = {
  success: boolean
  data: T
  message?: string
}

type BenchmarkRow = {
  endpoint: string
  method: 'GET' | 'POST'
  p50Ms: number
  p95Ms: number
  p99Ms: number
  avgMs: number
  reqPerSec: number
  meetsP95Target: boolean
}

const TARGET_P95_MS = Number(process.env.BENCH_TARGET_P95_MS ?? 350)
const CONNECTIONS = Number(process.env.BENCH_CONNECTIONS ?? 20)
const DURATION_SECONDS = Number(process.env.BENCH_DURATION_SECONDS ?? 20)
const POINTS_TO_SEED = Number(process.env.BENCH_POINTS_TO_SEED ?? 1000)
const SERIES_LIMIT = Number(process.env.BENCH_SERIES_LIMIT ?? 500)
const API_BASE_URL = (process.env.BENCH_API_BASE_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  ''
)
const API_URL = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL}/api`

function randomDigits(length: number) {
  let value = ''
  for (let i = 0; i < length; i++) {
    value += Math.floor(Math.random() * 10)
  }
  return value
}

async function parseJsonSafe<T>(response: Response): Promise<T> {
  const body = await response.text()
  try {
    return JSON.parse(body) as T
  } catch {
    throw new Error(`Invalid JSON response (${response.status}): ${body}`)
  }
}

async function postJson<T>(
  url: string,
  payload: unknown,
  token?: string
): Promise<ApiSuccess<T>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  })

  const json = await parseJsonSafe<ApiSuccess<T>>(response)
  if (!response.ok || !json.success) {
    throw new Error(
      `POST ${url} failed (${response.status}): ${JSON.stringify(json)}`
    )
  }

  return json
}

function runAutocannon(input: {
  title: string
  url: string
  method: 'GET' | 'POST'
  token?: string
  body?: string
}): Promise<BenchmarkRow> {
  return new Promise((resolve, reject) => {
    autocannon(
      {
        title: input.title,
        url: input.url,
        method: input.method,
        body: input.body,
        connections: CONNECTIONS,
        duration: DURATION_SECONDS,
        headers: {
          ...(input.token ? { Authorization: `Bearer ${input.token}` } : {}),
          ...(input.method === 'POST'
            ? { 'content-type': 'application/json' }
            : {})
        }
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('autocannon failed'))
          return
        }

        resolve({
          endpoint: input.url.replace(API_URL, ''),
          method: input.method,
          p50Ms: result.latency.p50,
          p95Ms: result.latency.p97_5,
          p99Ms: result.latency.p99,
          avgMs: result.latency.average,
          reqPerSec: result.requests.average,
          meetsP95Target: result.latency.p97_5 < TARGET_P95_MS
        })
      }
    )
  })
}

function buildPoints(count: number) {
  const start = new Date('2026-01-01T00:00:00.000Z')

  return Array.from({ length: count }, (_, index) => {
    const timestamp = new Date(start)
    timestamp.setUTCSeconds(start.getUTCSeconds() + index)

    return {
      timestamp: timestamp.toISOString(),
      x: Number((Math.sin(index / 10) * 3).toFixed(4)),
      y: Number((Math.cos(index / 10) * 2).toFixed(4)),
      z: Number((Math.sin(index / 5) * 1.5).toFixed(4)),
      temperature: Number((24 + Math.sin(index / 50)).toFixed(2))
    }
  })
}

function printRows(rows: BenchmarkRow[]) {
  console.log('\nAPI Benchmark Result\n')
  console.log('| Endpoint | Method | p50 (ms) | p95 (ms) | p99 (ms) | Avg (ms) | req/s | p95 < target |')
  console.log('|---|---:|---:|---:|---:|---:|---:|---:|')
  for (const row of rows) {
    console.log(
      `| ${row.endpoint} | ${row.method} | ${row.p50Ms.toFixed(1)} | ${row.p95Ms.toFixed(1)} | ${row.p99Ms.toFixed(1)} | ${row.avgMs.toFixed(1)} | ${row.reqPerSec.toFixed(1)} | ${row.meetsP95Target ? 'YES' : 'NO'} |`
    )
  }

  const allPassed = rows.every((row) => row.meetsP95Target)
  console.log(
    `\nTarget: p95 < ${TARGET_P95_MS}ms (${allPassed ? 'PASSED' : 'FAILED'})\n`
  )
}

async function main() {
  console.log('Preparing benchmark data...')
  console.log(`API: ${API_URL}`)

  const suffix = `${Date.now()}${randomDigits(2)}`
  const email = `bench.${suffix}@example.com`
  const password = 'Password123'

  await postJson<{ user: { uuid: string } }>(`${API_URL}/auth/register`, {
    email,
    password,
    name: `Bench User ${suffix}`
  })

  const login = await postJson<{
    token: string
    user: { uuid: string; email: string }
  }>(`${API_URL}/auth/login`, {
    email,
    password
  })

  const token = login.data.token

  const machine = await postJson<{ uuid: string }>(
    `${API_URL}/machines`,
    {
      name: `Bench Machine ${suffix}`,
      type: 'Fan'
    },
    token
  )

  const monitoringPoint = await postJson<{ uuid: string }>(
    `${API_URL}/monitoring-points`,
    {
      name: `Bench MP ${suffix}`,
      machineUuid: machine.data.uuid
    },
    token
  )

  const sensor = await postJson<{ uuid: string }>(
    `${API_URL}/sensors`,
    {
      sensorUniqueId: `BENCHX-${suffix.slice(-3)}`,
      model: 'TcAg',
      monitoringPointUuid: monitoringPoint.data.uuid
    },
    token
  )

  const points = buildPoints(POINTS_TO_SEED)

  await postJson(`${API_URL}/sensors/${sensor.data.uuid}/time-series`, {
    intervalMinutes: 1,
    points
  }, token)

  console.log('Running benchmark...')
  console.log(
    `connections=${CONNECTIONS}, duration=${DURATION_SECONDS}s, pointsSeeded=${POINTS_TO_SEED}, seriesLimit=${SERIES_LIMIT}, targetP95=${TARGET_P95_MS}ms`
  )

  const rows: BenchmarkRow[] = []

  rows.push(
    await runAutocannon({
      title: 'auth me',
      method: 'GET',
      url: `${API_URL}/auth/me`,
      token
    })
  )

  rows.push(
    await runAutocannon({
      title: 'machines',
      method: 'GET',
      url: `${API_URL}/machines`,
      token
    })
  )

  rows.push(
    await runAutocannon({
      title: 'monitoring points',
      method: 'GET',
      url: `${API_URL}/monitoring-points?page=1&limit=10&sortBy=createdAt&sortOrder=desc`,
      token
    })
  )

  rows.push(
    await runAutocannon({
      title: 'sensors',
      method: 'GET',
      url: `${API_URL}/sensors`,
      token
    })
  )

  rows.push(
    await runAutocannon({
      title: 'list time-series',
      method: 'GET',
      url: `${API_URL}/sensors/${sensor.data.uuid}/time-series?limit=${SERIES_LIMIT}&order=desc`,
      token
    })
  )

  rows.push(
    await runAutocannon({
      title: 'metrics',
      method: 'GET',
      url: `${API_URL}/sensors/${sensor.data.uuid}/time-series/metrics`,
      token
    })
  )

  rows.push(
    await runAutocannon({
      title: 'count',
      method: 'GET',
      url: `${API_URL}/sensors/${sensor.data.uuid}/time-series/count`,
      token
    })
  )

  printRows(rows)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
