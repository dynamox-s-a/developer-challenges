import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { dbDisconnect, dbReset } from '../helpers/db'
import { makeTestApp } from '../helpers/makeTestApp'
import { createMachine, createUserAndLogin } from '../helpers/factories'

describe.sequential('Machines API integration', () => {
  const app = makeTestApp()

  beforeEach(async () => {
    await dbReset()
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('creates, lists, gets, updates and deletes a machine', async () => {
    const { token } = await createUserAndLogin(app)

    const create = await request(app)
      .post('/api/machines')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Machine A', type: 'Fan' })

    expect(create.status).toBe(201)
    expect(create.body.success).toBe(true)

    const machineUuid = create.body.data.uuid as string

    const list = await request(app)
      .get('/api/machines')
      .set('Authorization', `Bearer ${token}`)

    expect(list.status).toBe(200)
    expect(list.body.success).toBe(true)
    expect(list.body.data).toHaveLength(1)

    const get = await request(app)
      .get(`/api/machines/${machineUuid}`)
      .set('Authorization', `Bearer ${token}`)

    expect(get.status).toBe(200)
    expect(get.body.success).toBe(true)
    expect(get.body.data.name).toBe('Machine A')

    const update = await request(app)
      .patch(`/api/machines/${machineUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Machine B', type: 'Pump' })

    expect(update.status).toBe(200)
    expect(update.body.success).toBe(true)
    expect(update.body.data.name).toBe('Machine B')
    expect(update.body.data.type).toBe('Pump')

    const remove = await request(app)
      .delete(`/api/machines/${machineUuid}`)
      .set('Authorization', `Bearer ${token}`)

    expect(remove.status).toBe(200)
    expect(remove.body.success).toBe(true)

    const listAfterDelete = await request(app)
      .get('/api/machines')
      .set('Authorization', `Bearer ${token}`)

    expect(listAfterDelete.status).toBe(200)
    expect(listAfterDelete.body.data).toHaveLength(0)
  })

  it('enforces duplicate and ownership rules', async () => {
    const owner = await createUserAndLogin(app)
    const stranger = await createUserAndLogin(app)

    const machine = await createMachine(app, owner.token, {
      name: 'Machine Unique',
      type: 'Fan'
    })

    const duplicate = await request(app)
      .post('/api/machines')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ name: 'Machine Unique', type: 'Fan' })

    expect(duplicate.status).toBe(400)
    expect(duplicate.body.success).toBe(false)

    const forbiddenGet = await request(app)
      .get(`/api/machines/${machine.uuid}`)
      .set('Authorization', `Bearer ${stranger.token}`)

    expect(forbiddenGet.status).toBe(404)
    expect(forbiddenGet.body.success).toBe(false)
  })
})
