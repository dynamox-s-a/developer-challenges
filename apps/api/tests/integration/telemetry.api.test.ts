import request from 'supertest'
import { describe, expect, it, beforeAll, beforeEach, afterAll } from 'vitest'

import { makeTestApp } from '../helpers/makeTestApp'
import { dbDisconnect, dbReset } from '../helpers/db'
import {
  createMachine,
  createMonitoringPoint,
  createSensor,
  createUserAndLogin
} from '../helpers/factories'

type TimeSeriesPointPayload = {
  timestamp: string
  x: number
  y: number
  z: number
  temperature: number
}

function buildSeries(
  startIso = '2026-01-05T00:00:00.000Z',
  count = 8,
  intervalMinutes = 2
): TimeSeriesPointPayload[] {
  const start = new Date(startIso)

  return Array.from({ length: count }, (_, index) => {
    const timestamp = new Date(start)
    timestamp.setUTCMinutes(start.getUTCMinutes() + index * intervalMinutes)

    const x = index + 1
    const y = (index + 1) * 2
    const z = index % 2 === 0 ? index + 0.5 : -(index + 0.5)
    const temperature = 20 + index

    return {
      timestamp: timestamp.toISOString(),
      x,
      y,
      z,
      temperature
    }
  })
}

describe.sequential('Telemetry API integration', () => {
  const app = makeTestApp()

  beforeAll(async () => {
    await dbReset()
  })

  beforeEach(async () => {
    await dbReset()
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('executes complete happy path for time-series management', async () => {
    const { token } = await createUserAndLogin(app)
    const machine = await createMachine(app, token, { type: 'Fan' })
    const monitoringPoint = await createMonitoringPoint(app, token, machine.uuid)
    const sensor = await createSensor(app, token, monitoringPoint.uuid, {
      model: 'TcAg'
    })

    const points = buildSeries('2026-01-05T00:00:00.000Z', 6, 1)

    const createResponse = await request(app)
      .post(`/api/sensors/${sensor.uuid}/time-series`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        intervalMinutes: 1,
        points
      })

    expect(createResponse.status).toBe(201)
    expect(createResponse.body.success).toBe(true)
    expect(createResponse.body.data.insertedPoints).toBe(6)

    const countResponse = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series/count`)
      .set('Authorization', `Bearer ${token}`)

    expect(countResponse.status).toBe(200)
    expect(countResponse.body.success).toBe(true)
    expect(countResponse.body.data).toEqual({
      timeSeriesCount: 1,
      pointsCount: 6
    })

    const pointsResponse = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series`)
      .set('Authorization', `Bearer ${token}`)

    expect(pointsResponse.status).toBe(200)
    expect(pointsResponse.body.success).toBe(true)
    expect(pointsResponse.body.data.sensor.uuid).toBe(sensor.uuid)
    expect(pointsResponse.body.data.points.length).toBe(6)
    expect(pointsResponse.body.data.points[0]).toMatchObject({
      timestamp: expect.any(String),
      x: expect.any(Number),
      y: expect.any(Number),
      z: expect.any(Number),
      temperature: expect.any(Number),
      accelerationRms: expect.any(Number)
    })

    const metricsResponse = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series/metrics`)
      .set('Authorization', `Bearer ${token}`)

    expect(metricsResponse.status).toBe(200)
    expect(metricsResponse.body.success).toBe(true)
    expect(metricsResponse.body.data.pointsCount).toBe(6)
    expect(metricsResponse.body.data.firstTimestamp).toBeDefined()
    expect(metricsResponse.body.data.lastTimestamp).toBeDefined()
    expect(metricsResponse.body.data.x).toMatchObject({
      min: expect.any(Number),
      max: expect.any(Number),
      avg: expect.any(Number)
    })
    expect(metricsResponse.body.data.y).toMatchObject({
      min: expect.any(Number),
      max: expect.any(Number),
      avg: expect.any(Number)
    })
    expect(metricsResponse.body.data.z).toMatchObject({
      min: expect.any(Number),
      max: expect.any(Number),
      avg: expect.any(Number)
    })
    expect(metricsResponse.body.data.temperature).toMatchObject({
      min: expect.any(Number),
      max: expect.any(Number),
      avg: expect.any(Number)
    })
    expect(metricsResponse.body.data.accelerationRms).toMatchObject({
      min: expect.any(Number),
      max: expect.any(Number),
      avg: expect.any(Number)
    })

    expect(metricsResponse.body.data.lastPoint).toMatchObject({
      timestamp: metricsResponse.body.data.lastTimestamp
    })
    expect(metricsResponse.body.data.x.min).toBe(1)
    expect(metricsResponse.body.data.x.max).toBe(6)
    expect(metricsResponse.body.data.x.avg).toBeCloseTo(3.5, 10)

    const deleteResponse = await request(app)
      .delete(`/api/sensors/${sensor.uuid}/time-series?all=true`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteResponse.status).toBe(200)
    expect(deleteResponse.body.success).toBe(true)
    expect(deleteResponse.body.data.deletedPoints).toBe(6)

    const countAfterDelete = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series/count`)
      .set('Authorization', `Bearer ${token}`)

    expect(countAfterDelete.status).toBe(200)
    expect(countAfterDelete.body.success).toBe(true)
    expect(countAfterDelete.body.data.pointsCount).toBe(0)
    expect(countAfterDelete.body.data.timeSeriesCount).toBe(0)
  })

  it('applies filtering, ordering and limit for points and metrics', async () => {
    const { token } = await createUserAndLogin(app)
    const machine = await createMachine(app, token, { type: 'Fan' })
    const monitoringPoint = await createMonitoringPoint(app, token, machine.uuid)
    const sensor = await createSensor(app, token, monitoringPoint.uuid, {
      model: 'TcAg'
    })

    const points = buildSeries('2026-01-06T00:00:00.000Z', 8, 1)

    await request(app)
      .post(`/api/sensors/${sensor.uuid}/time-series`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        intervalMinutes: 1,
        points
      })
      .expect(201)

    const from = points[2].timestamp
    const to = points[6].timestamp

    const listResponse = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series`)
      .query({
        from,
        to,
        order: 'asc',
        limit: 3
      })
      .set('Authorization', `Bearer ${token}`)

    expect(listResponse.status).toBe(200)
    expect(listResponse.body.success).toBe(true)
    expect(listResponse.body.data.query.order).toBe('asc')
    expect(listResponse.body.data.query.limit).toBe(3)
    expect(listResponse.body.data.points.length).toBe(3)

    const listedTimestamps = listResponse.body.data.points.map(
      (point: { timestamp: string }) => new Date(point.timestamp).getTime()
    )

    expect(listedTimestamps[0]).toBeLessThanOrEqual(listedTimestamps[1])
    expect(listedTimestamps[1]).toBeLessThanOrEqual(listedTimestamps[2])

    const metricsResponse = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series/metrics`)
      .query({ from, to })
      .set('Authorization', `Bearer ${token}`)

    expect(metricsResponse.status).toBe(200)
    expect(metricsResponse.body.success).toBe(true)
    expect(metricsResponse.body.data.pointsCount).toBe(5)

    const first = new Date(metricsResponse.body.data.firstTimestamp)
    const last = new Date(metricsResponse.body.data.lastTimestamp)

    expect(first.getTime()).toBeGreaterThanOrEqual(new Date(from).getTime())
    expect(last.getTime()).toBeLessThanOrEqual(new Date(to).getTime())
  })

  it('returns contract errors for invalid payloads, invalid sensor and invalid range', async () => {
    const { token } = await createUserAndLogin(app)
    const machine = await createMachine(app, token, { type: 'Fan' })
    const monitoringPoint = await createMonitoringPoint(app, token, machine.uuid)
    const sensor = await createSensor(app, token, monitoringPoint.uuid, {
      model: 'TcAg'
    })

    const invalidInterval = await request(app)
      .post(`/api/sensors/${sensor.uuid}/time-series`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        intervalMinutes: 0,
        points: [
          {
            timestamp: '2026-01-07T00:00:00.000Z',
            x: 1,
            y: 2,
            z: 3,
            temperature: 24
          }
        ]
      })

    expect(invalidInterval.status).toBe(400)
    expect(invalidInterval.body.success).toBe(false)

    const emptyPoints = await request(app)
      .post(`/api/sensors/${sensor.uuid}/time-series`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        intervalMinutes: 1,
        points: []
      })

    expect(emptyPoints.status).toBe(400)
    expect(emptyPoints.body.success).toBe(false)

    const unknownSensor = await request(app)
      .post('/api/sensors/6f55e653-a3bc-4f39-8f4f-4f5ffdb40dce/time-series')
      .set('Authorization', `Bearer ${token}`)
      .send({
        intervalMinutes: 1,
        points: [
          {
            timestamp: '2026-01-07T00:00:00.000Z',
            x: 1,
            y: 2,
            z: 3,
            temperature: 24
          }
        ]
      })

    expect([400, 404]).toContain(unknownSensor.status)
    expect(unknownSensor.body.success).toBe(false)

    const invalidRange = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series/metrics`)
      .query({
        from: '2026-01-08T00:10:00.000Z',
        to: '2026-01-08T00:00:00.000Z'
      })
      .set('Authorization', `Bearer ${token}`)

    expect(invalidRange.status).toBe(400)
    expect(invalidRange.body.success).toBe(false)

    const invalidRangeForList = await request(app)
      .get(`/api/sensors/${sensor.uuid}/time-series`)
      .query({
        from: '2026-01-08T00:10:00.000Z',
        to: '2026-01-08T00:00:00.000Z'
      })
      .set('Authorization', `Bearer ${token}`)

    expect(invalidRangeForList.status).toBe(400)
    expect(invalidRangeForList.body.success).toBe(false)
  })
})
