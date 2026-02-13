import { describe, expect, it } from 'vitest'
import {
  timeSeriesCreateSchema,
  timeSeriesListQuerySchema,
  timeSeriesMetricsQuerySchema
} from '../../src/modules/telemetry/telemetry.schemas'

describe('telemetry schemas', () => {
  describe('timeSeriesCreateSchema', () => {
    const validPoint = {
      timestamp: '2026-01-01T00:00:00.000Z',
      x: 1,
      y: 2,
      z: 3,
      temperature: 25
    }

    it('accepts intervalMinutes between 1 and 60', () => {
      expect(() =>
        timeSeriesCreateSchema.parse({ intervalMinutes: 1, points: [validPoint] })
      ).not.toThrow()

      expect(() =>
        timeSeriesCreateSchema.parse({ intervalMinutes: 60, points: [validPoint] })
      ).not.toThrow()
    })

    it('rejects intervalMinutes outside 1..60', () => {
      expect(() =>
        timeSeriesCreateSchema.parse({ intervalMinutes: 0, points: [validPoint] })
      ).toThrow()

      expect(() =>
        timeSeriesCreateSchema.parse({ intervalMinutes: 61, points: [validPoint] })
      ).toThrow()
    })

    it('enforces points size between 1 and 5000', () => {
      expect(() =>
        timeSeriesCreateSchema.parse({ intervalMinutes: 5, points: [] })
      ).toThrow()

      expect(() =>
        timeSeriesCreateSchema.parse({
          intervalMinutes: 5,
          points: Array.from({ length: 5001 }, () => validPoint)
        })
      ).toThrow()
    })

    it('coerces ISO timestamp strings to Date', () => {
      const parsed = timeSeriesCreateSchema.parse({
        intervalMinutes: 5,
        points: [validPoint]
      })

      expect(parsed.points[0].timestamp).toBeInstanceOf(Date)
      expect(parsed.points[0].timestamp.toISOString()).toBe(validPoint.timestamp)
    })

    it('rejects invalid timestamp values', () => {
      expect(() =>
        timeSeriesCreateSchema.parse({
          intervalMinutes: 5,
          points: [{ ...validPoint, timestamp: 'not-a-date' }]
        })
      ).toThrow()
    })

    it('rejects NaN and Infinity numeric values', () => {
      expect(() =>
        timeSeriesCreateSchema.parse({
          intervalMinutes: 5,
          points: [{ ...validPoint, x: Number.NaN }]
        })
      ).toThrow()

      expect(() =>
        timeSeriesCreateSchema.parse({
          intervalMinutes: 5,
          points: [{ ...validPoint, y: Number.POSITIVE_INFINITY }]
        })
      ).toThrow()
    })
  })

  describe('range query validation', () => {
    it('rejects from > to for list', () => {
      expect(() =>
        timeSeriesListQuerySchema.parse({
          from: '2026-01-02T00:00:00.000Z',
          to: '2026-01-01T00:00:00.000Z'
        })
      ).toThrow()
    })

    it('rejects from > to for metrics', () => {
      expect(() =>
        timeSeriesMetricsQuerySchema.parse({
          from: '2026-01-02T00:00:00.000Z',
          to: '2026-01-01T00:00:00.000Z'
        })
      ).toThrow()
    })
  })
})
