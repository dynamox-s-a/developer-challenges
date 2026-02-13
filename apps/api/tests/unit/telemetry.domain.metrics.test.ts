import { describe, expect, it } from 'vitest'
import { calculateTelemetryMetrics } from '../../src/modules/telemetry/telemetry.domain'
import { goldenExpected, goldenPoints } from '../fixtures/goldenTelemetry'

describe('telemetry domain - calculateTelemetryMetrics', () => {
  it('returns expected metrics for the golden dataset', () => {
    const metrics = calculateTelemetryMetrics(goldenPoints)

    expect(metrics.pointsCount).toBe(goldenExpected.pointsCount)
    expect(metrics.firstTimestamp).toEqual(goldenExpected.firstTimestamp)
    expect(metrics.lastTimestamp).toEqual(goldenExpected.lastTimestamp)

    expect(metrics.x.min).toBe(goldenExpected.x.min)
    expect(metrics.x.max).toBe(goldenExpected.x.max)
    expect(metrics.x.avg).toBeCloseTo(goldenExpected.x.avg, 10)

    expect(metrics.y.min).toBe(goldenExpected.y.min)
    expect(metrics.y.max).toBe(goldenExpected.y.max)
    expect(metrics.y.avg).toBeCloseTo(goldenExpected.y.avg, 10)

    expect(metrics.z.min).toBe(goldenExpected.z.min)
    expect(metrics.z.max).toBe(goldenExpected.z.max)
    expect(metrics.z.avg).toBeCloseTo(goldenExpected.z.avg, 10)

    expect(metrics.temperature.min).toBe(goldenExpected.temperature.min)
    expect(metrics.temperature.max).toBe(goldenExpected.temperature.max)
    expect(metrics.temperature.avg).toBeCloseTo(goldenExpected.temperature.avg, 10)

    expect(metrics.accelerationRms.min).toBeCloseTo(
      goldenExpected.accelerationRms.min,
      12
    )
    expect(metrics.accelerationRms.max).toBe(goldenExpected.accelerationRms.max)
    expect(metrics.accelerationRms.avg).toBeCloseTo(
      goldenExpected.accelerationRms.avg,
      10
    )

    expect(metrics.lastPoint).not.toBeNull()
    expect(metrics.lastPoint?.timestamp).toEqual(goldenExpected.lastPointTimestamp)
  })

  it('returns null metrics for empty datasets', () => {
    const metrics = calculateTelemetryMetrics([])

    expect(metrics.pointsCount).toBe(0)
    expect(metrics.firstTimestamp).toBeNull()
    expect(metrics.lastTimestamp).toBeNull()
    expect(metrics.lastPoint).toBeNull()
    expect(metrics.x).toEqual({ min: null, max: null, avg: null })
    expect(metrics.accelerationRms).toEqual({ min: null, max: null, avg: null })
  })
})
