import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { dbDisconnect, dbReset } from '../helpers/db'
import { makeTestApp } from '../helpers/makeTestApp'
import {
  createMachine,
  createMonitoringPoint,
  createUserAndLogin
} from '../helpers/factories'

describe.sequential('Monitoring Points API integration', () => {
  const app = makeTestApp()

  beforeEach(async () => {
    await dbReset()
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('creates, lists, updates and deletes monitoring points', async () => {
    const { token } = await createUserAndLogin(app)
    const machine = await createMachine(app, token, { type: 'Fan' })

    const create = await request(app)
      .post('/api/monitoring-points')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'MP Main', machineUuid: machine.uuid })

    expect(create.status).toBe(201)
    expect(create.body.success).toBe(true)
    expect(create.body.data.machine.uuid).toBe(machine.uuid)

    const monitoringPointUuid = create.body.data.uuid as string

    const list = await request(app)
      .get('/api/monitoring-points')
      .query({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      .set('Authorization', `Bearer ${token}`)

    expect(list.status).toBe(200)
    expect(list.body.success).toBe(true)
    expect(list.body.data.data).toHaveLength(1)
    expect(list.body.data.pagination.total).toBe(1)

    const update = await request(app)
      .patch(`/api/monitoring-points/${monitoringPointUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'MP Updated' })

    expect(update.status).toBe(200)
    expect(update.body.success).toBe(true)
    expect(update.body.data.name).toBe('MP Updated')

    const remove = await request(app)
      .delete(`/api/monitoring-points/${monitoringPointUuid}`)
      .set('Authorization', `Bearer ${token}`)

    expect(remove.status).toBe(200)
    expect(remove.body.success).toBe(true)

    const listAfterDelete = await request(app)
      .get('/api/monitoring-points')
      .set('Authorization', `Bearer ${token}`)

    expect(listAfterDelete.status).toBe(200)
    expect(listAfterDelete.body.data.data).toHaveLength(0)
  })

  it('prevents creating monitoring points on machines owned by another user', async () => {
    const owner = await createUserAndLogin(app)
    const stranger = await createUserAndLogin(app)

    const machine = await createMachine(app, owner.token, { type: 'Fan' })

    const forbiddenCreate = await request(app)
      .post('/api/monitoring-points')
      .set('Authorization', `Bearer ${stranger.token}`)
      .send({ name: 'Forbidden MP', machineUuid: machine.uuid })

    expect(forbiddenCreate.status).toBe(403)
    expect(forbiddenCreate.body.success).toBe(false)
  })

  it('supports filtering by machineUuid in list endpoint', async () => {
    const { token } = await createUserAndLogin(app)
    const machineA = await createMachine(app, token, { name: 'Machine A', type: 'Fan' })
    const machineB = await createMachine(app, token, { name: 'Machine B', type: 'Pump' })

    await createMonitoringPoint(app, token, machineA.uuid, { name: 'A1' })
    await createMonitoringPoint(app, token, machineB.uuid, { name: 'B1' })

    const filtered = await request(app)
      .get('/api/monitoring-points')
      .query({ machineUuid: machineA.uuid, page: 1, limit: 10 })
      .set('Authorization', `Bearer ${token}`)

    expect(filtered.status).toBe(200)
    expect(filtered.body.success).toBe(true)
    expect(filtered.body.data.data).toHaveLength(1)
    expect(filtered.body.data.data[0].machine.uuid).toBe(machineA.uuid)
  })
})
