type NumericMetrics = {
  min: number | null
  max: number | null
  avg: number | null
}

export type TelemetryPointInput = {
  timestamp: Date
  x: number
  y: number
  z: number
  temperature: number
  accelerationRms?: number | null
}

export function computeAccelerationRms(x: number, y: number, z: number) {
  return Math.sqrt(x * x + y * y + z * z)
}

function summarize(values: number[]): NumericMetrics {
  if (values.length === 0) {
    return { min: null, max: null, avg: null }
  }

  let min = values[0]
  let max = values[0]
  let sum = 0

  for (const value of values) {
    if (value < min) min = value
    if (value > max) max = value
    sum += value
  }

  return {
    min,
    max,
    avg: sum / values.length
  }
}

export function calculateTelemetryMetrics(points: TelemetryPointInput[]) {
  if (points.length === 0) {
    return {
      pointsCount: 0,
      firstTimestamp: null,
      lastTimestamp: null,
      x: summarize([]),
      y: summarize([]),
      z: summarize([]),
      temperature: summarize([]),
      accelerationRms: summarize([]),
      lastPoint: null
    }
  }

  const normalized = points.map((point) => ({
    ...point,
    accelerationRms:
      point.accelerationRms ?? computeAccelerationRms(point.x, point.y, point.z)
  }))

  const sortedByTimestamp = [...normalized].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  )

  return {
    pointsCount: normalized.length,
    firstTimestamp: sortedByTimestamp[0].timestamp,
    lastTimestamp: sortedByTimestamp[sortedByTimestamp.length - 1].timestamp,
    x: summarize(normalized.map((p) => p.x)),
    y: summarize(normalized.map((p) => p.y)),
    z: summarize(normalized.map((p) => p.z)),
    temperature: summarize(normalized.map((p) => p.temperature)),
    accelerationRms: summarize(normalized.map((p) => p.accelerationRms)),
    lastPoint: sortedByTimestamp[sortedByTimestamp.length - 1]
  }
}
