import { describe, expect, it } from 'vitest'
import { computeAccelerationRms } from '../../src/modules/telemetry/telemetry.domain'

describe('telemetry domain - computeAccelerationRms', () => {
  it('calculates RMS for known values', () => {
    expect(computeAccelerationRms(3, 4, 12)).toBeCloseTo(13, 10)
    expect(computeAccelerationRms(1, 2, 2)).toBeCloseTo(3, 10)
    expect(computeAccelerationRms(-3, -4, -12)).toBeCloseTo(13, 10)
  })
})
