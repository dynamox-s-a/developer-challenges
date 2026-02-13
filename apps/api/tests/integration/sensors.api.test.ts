import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { dbDisconnect, dbReset } from '../helpers/db'
import { makeTestApp } from '../helpers/makeTestApp'
import {
  createMachine,
  createMonitoringPoint,
  createSensor,
  createUserAndLogin
} from '../helpers/factories'

describe.sequential('Sensors API integration', () => {
  const app = makeTestApp()

  beforeEach(async () => {
    await dbReset()
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('creates, lists, updates and deletes sensors', async () => {
    const { token } = await createUserAndLogin(app)
    const machine = await createMachine(app, token, { type: 'Fan' })
    const monitoringPoint = await createMonitoringPoint(app, token, machine.uuid)

    const create = await request(app)
      .post('/api/sensors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sensorUniqueId: 'ABCDEF-123',
        model: 'TcAg',
        monitoringPointUuid: monitoringPoint.uuid
      })

    expect(create.status).toBe(201)
    expect(create.body.success).toBe(true)
    expect(create.body.data.sensorUniqueId).toBe('ABCDEF-123')

    const sensorUuid = create.body.data.uuid as string

    const list = await request(app)
      .get('/api/sensors')
      .set('Authorization', `Bearer ${token}`)

    expect(list.status).toBe(200)
    expect(list.body.success).toBe(true)
    expect(list.body.data).toHaveLength(1)

    const update = await request(app)
      .patch(`/api/sensors/${sensorUuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        sensorUniqueId: 'QWERTY-999',
        model: 'HF_PLUS'
      })

    expect(update.status).toBe(200)
    expect(update.body.success).toBe(true)
    expect(update.body.data.sensorUniqueId).toBe('QWERTY-999')
    expect(update.body.data.model).toBe('HF_PLUS')

    const remove = await request(app)
      .delete(`/api/sensors/${sensorUuid}`)
      .set('Authorization', `Bearer ${token}`)

    expect(remove.status).toBe(200)
    expect(remove.body.success).toBe(true)

    const listAfterDelete = await request(app)
      .get('/api/sensors')
      .set('Authorization', `Bearer ${token}`)

    expect(listAfterDelete.status).toBe(200)
    expect(listAfterDelete.body.data).toHaveLength(0)
  })

  it('enforces sensor business rules and schema contracts', async () => {
    const { token } = await createUserAndLogin(app)

    const pumpMachine = await createMachine(app, token, { type: 'Pump' })
    const pumpPoint = await createMonitoringPoint(app, token, pumpMachine.uuid)

    const pumpRestriction = await request(app)
      .post('/api/sensors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sensorUniqueId: 'PUMPAA-111',
        model: 'TcAg',
        monitoringPointUuid: pumpPoint.uuid
      })

    expect(pumpRestriction.status).toBe(400)
    expect(pumpRestriction.body.success).toBe(false)

    const fanMachine = await createMachine(app, token, { type: 'Fan' })
    const fanPoint = await createMonitoringPoint(app, token, fanMachine.uuid)

    const firstSensor = await createSensor(app, token, fanPoint.uuid, {
      sensorUniqueId: 'FANAAA-222',
      model: 'TcAg'
    })

    const duplicatePointSensor = await request(app)
      .post('/api/sensors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sensorUniqueId: 'FANBBB-333',
        model: 'HF_PLUS',
        monitoringPointUuid: fanPoint.uuid
      })

    expect(duplicatePointSensor.status).toBe(400)
    expect(duplicatePointSensor.body.success).toBe(false)

    const invalidUniqueId = await request(app)
      .post('/api/sensors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sensorUniqueId: 'bad-id',
        model: 'HF_PLUS',
        monitoringPointUuid: fanPoint.uuid
      })

    expect(invalidUniqueId.status).toBe(400)
    expect(invalidUniqueId.body.success).toBe(false)

    const secondPoint = await createMonitoringPoint(app, token, fanMachine.uuid)
    const secondSensor = await createSensor(app, token, secondPoint.uuid, {
      sensorUniqueId: 'FANCCC-444',
      model: 'HF_PLUS'
    })

    const duplicateUniqueId = await request(app)
      .patch(`/api/sensors/${secondSensor.uuid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        sensorUniqueId: 'FANAAA-222'
      })

    expect(duplicateUniqueId.status).toBe(400)
    expect(duplicateUniqueId.body.success).toBe(false)
  })

  it('enforces ownership for sensor deletion', async () => {
    const owner = await createUserAndLogin(app)
    const stranger = await createUserAndLogin(app)

    const machine = await createMachine(app, owner.token, { type: 'Fan' })
    const monitoringPoint = await createMonitoringPoint(app, owner.token, machine.uuid)
    const sensor = await createSensor(app, owner.token, monitoringPoint.uuid, {
      sensorUniqueId: 'OWNERA-444',
      model: 'TcAg'
    })

    const forbiddenDelete = await request(app)
      .delete(`/api/sensors/${sensor.uuid}`)
      .set('Authorization', `Bearer ${stranger.token}`)

    expect(forbiddenDelete.status).toBe(403)
    expect(forbiddenDelete.body.success).toBe(false)
  })
})
