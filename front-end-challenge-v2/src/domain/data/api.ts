import { PreparedSeries, Series } from './types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function fetchIndex(i: number): Promise<Series | null> {
  const r = await fetch(`${BASE}/${i}`)
  if (!r.ok) return null
  const s = (await r.json()) as Series
  if (!s?.name || !Array.isArray(s.data)) return null
  return s
}

export async function fetchAllRawSeries(
  start = 0,
  hardLimit = 64,
  missesToStop = 5
): Promise<Series[]> {
  const list: Series[] = []
  let miss = 0
  for (let i = start; i < hardLimit; i++) {
    const s = await fetchIndex(i)
    if (s) {
      list.push(s)
      miss = 0
    } else {
      miss++
      if (miss >= missesToStop) break
    }
  }
  return list
}

const toPrepared = (s: Series): PreparedSeries => ({
  id: s.name,
  points: s.data.map((p) => {
    const x = Date.parse(p.datetime)
    const y =
      typeof p.max === 'number' && Number.isFinite(p.max) ? p.max : 0
    return [x, y] as [number, number]
  }),
})

const hasPrefix = (s: Series, prefixes: string[]) =>
  prefixes.some((p) => s.name.toLowerCase().startsWith(p.toLowerCase()))

export async function fetchAllMetrics(): Promise<{
  acceleration: PreparedSeries[]
  velocity: PreparedSeries[]
  temperature: PreparedSeries[]
}> {
  const all = await fetchAllRawSeries()

  const acceleration = all
    .filter((s) => hasPrefix(s, ['accelerationrms', 'acceleration']))
    .map(toPrepared)

  const velocity = all
    .filter((s) => hasPrefix(s, ['velocityrms', 'velocity']))
    .map(toPrepared)

  const temperature = all
    .filter((s) => hasPrefix(s, ['temperature']))
    .map(toPrepared)

  return { acceleration, velocity, temperature }
}
