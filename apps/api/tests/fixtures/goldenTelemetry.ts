import type { TelemetryPointInput } from '../../src/modules/telemetry/telemetry.domain'

const base = '2026-01-01T00:00:00.000Z'

function atMinute(minute: number) {
  const date = new Date(base)
  date.setUTCMinutes(date.getUTCMinutes() + minute)
  return date
}

export const goldenPoints: TelemetryPointInput[] = [
  { timestamp: atMinute(0), x: 1, y: 2, z: 2, temperature: 30 },
  { timestamp: atMinute(1), x: 2, y: 0, z: 0, temperature: 32 },
  { timestamp: atMinute(2), x: -1, y: -2, z: -2, temperature: 28 },
  { timestamp: atMinute(3), x: 0, y: 3, z: 4, temperature: 29 },
  { timestamp: atMinute(4), x: 5, y: 12, z: 0, temperature: 31 },
  { timestamp: atMinute(5), x: 3, y: 4, z: 12, temperature: 27 },
  { timestamp: atMinute(6), x: -3, y: -4, z: -12, temperature: 35 },
  { timestamp: atMinute(7), x: 1.5, y: 2.5, z: 3.5, temperature: 26 },
  { timestamp: atMinute(8), x: 0.1, y: 0.2, z: 0.3, temperature: 25 },
  { timestamp: atMinute(9), x: 8, y: 6, z: 0, temperature: 33 }
]

export const goldenExpected = {
  pointsCount: 10,
  firstTimestamp: atMinute(0),
  lastTimestamp: atMinute(9),
  x: { min: -3, max: 8, avg: 1.66 },
  y: { min: -4, max: 12, avg: 2.37 },
  z: { min: -12, max: 12, avg: 0.78 },
  temperature: { min: 25, max: 35, avg: 29.6 },
  accelerationRms: {
    min: 0.37416573867739417,
    max: 13,
    avg: 6.6929382528323375
  },
  lastPointTimestamp: atMinute(9)
}
